import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native'
import ContentContainer from '../components/ContentContainer'
import { useIsFocused } from '@react-navigation/native'
import { wait } from '../utils/promise'
import { getRefreshRates, listAllApps } from '../services/module'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { makeDotWidth } from '../utils/string'
import { accentColor } from '../config/color'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const APP_REFRESH_RATES_KEY = 'app_refresh_rates'

export default function Apps(): JSX.Element {
  const rootViewRef = useRef<any>(null)
  const scrollViewRef = useRef<any>(null)
  const isFocused = useIsFocused()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isRefreshing, setRefreshing] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])
  const [searchData, setSearchData] = useState<any[]>([])
  const [originalData, setOriginalData] = useState<any[]>([])
  const [isAnimating, setAnimating] = useState<boolean>(false)
  const [offset, setOffset] = useState<number>(10)
  const [showSystem, setShowSystem] = useState<boolean>(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [refreshRate, setRefreshRate] = useState<any>({})

  const prepareData = useCallback(async () => {
    setLoading(true)
    setOffset(10)

    try {
      const apps = await listAllApps()
      const appRefreshRates = await AsyncStorage.getItem(APP_REFRESH_RATES_KEY)
      if (appRefreshRates !== null) setRefreshRate(JSON.parse(appRefreshRates))
      setOriginalData(apps)
    } catch (err: any) {
      ToastAndroid.show(
        "Something wen't wrong while loading the apps.",
        ToastAndroid.LONG
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (rootViewRef.current !== null) {
      if (isFocused) {
        prepareData()
      } else {
        setLoading(true)
      }
    }
  }, [isFocused])

  useEffect(() => {
    if (originalData) {
      const original = originalData.filter((v: any) => v.isUserApp)
      setData(original)
      setSearchData(original)
    }
  }, [originalData])

  useEffect(() => {
    let message: string = ''

    if (showSystem) {
      setData(originalData)
      setSearchData(originalData)
      message = 'Showing all apps include system apps.'
    } else {
      const original = originalData.filter((v: any) => v.isUserApp)
      setData(original)
      setSearchData(original)
      message = 'Showing installed apps by user.'
    }

    ToastAndroid.show(message, ToastAndroid.SHORT)
  }, [showSystem])

  useEffect(() => {
    if (Object.keys(refreshRate).length > 0) {
      const prepareToStore = async () => {
        try {
          await AsyncStorage.setItem(
            APP_REFRESH_RATES_KEY,
            JSON.stringify(refreshRate)
          )
        } catch (e: any) {
          ToastAndroid.show(
            "Something wen't wrong while setting refresh rate",
            ToastAndroid.SHORT
          )
        }
      }

      prepareToStore()
    }
  }, [refreshRate])

  const handleSearchText = async (text: string) => {
    text = text.toLocaleLowerCase()

    if (text.length === 0) {
      setData(searchData)
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    setData(
      searchData.filter(
        (v: any) =>
          v.appName.toLowerCase().includes(text) ||
          v.packageName.toLowerCase().includes(text)
      )
    )
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    if (!isSearching) {
      prepareData()
    } else {
      await wait(200)
      setRefreshing(false)
      setAnimating(false)
    }
  }

  const handleLoadMore = async () => {
    if (data.length === offset) {
      setAnimating(false)
      return
    }

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }

    await wait(500)
    setAnimating(false)
    setOffset(offset + 10)
  }

  const handleAppClick = async (value: any) => {
    const refreshRates = (await getRefreshRates())
      .map((rr: any) => parseInt(rr.value))
      .sort((a: number, b: number) => a - b) as []

    const appRefreshRate = refreshRate[value.packageName]

    const maxRefreshRate = Math.max(...refreshRates)
    const minRefreshRate = Math.min(...refreshRates)
    let currentRefreshRate: any

    if (!appRefreshRate || isNaN(appRefreshRate.value)) {
      setRefreshRate({
        ...refreshRate,
        [value.packageName]: { value: minRefreshRate, color: '#F50057' }
      })
    } else if (minRefreshRate === appRefreshRate) {
      setRefreshRate({
        ...refreshRate,
        [value.packageName]: {
          value: refreshRates.find((e: number) => e > minRefreshRate),
          color: '#00BFA6'
        }
      })
    } else if (
      (currentRefreshRate = refreshRates.find(
        (e: number) => e > appRefreshRate.value && e <= maxRefreshRate
      ))
    ) {
      setRefreshRate({
        ...refreshRate,
        [value.packageName]: {
          value: currentRefreshRate,
          color: currentRefreshRate === maxRefreshRate ? accentColor : '#00BFA6'
        }
      })
    } else if (maxRefreshRate === appRefreshRate.value) {
      setRefreshRate({
        ...refreshRate,
        [value.packageName]: { value: 'auto', color: '#6A6A6A' }
      })
    }
  }

  const handleRefreshRateString = (value: any) => {
    const currentRR = refreshRate[value.packageName]
    if (!currentRR || currentRR.value === 'auto') return 'AUTO'
    return String(currentRR.value).concat('Hz')
  }

  return (
    <ContentContainer
      rootViewRef={rootViewRef}
      scrollRef={scrollViewRef}
      headerTitle="Applications"
      subHeaderTitle="List of all running apps."
      loading={isLoading}
      handleSearch={handleSearchText}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      noData={data.length === 0}
      isAnimatingBottomIndicator={isAnimating}
      onMomentomScrollAtBottom={() => setAnimating(true)}
      onScrollAtBottom={handleLoadMore}
      onFilterClick={(filter: boolean) => setShowSystem(!filter)}>
      <View style={{ marginTop: wp(2) }}>
        {data.slice(0, offset).map((value: any, key: number) => (
          <View style={styles.container} key={key}>
            <Image
              resizeMode="contain"
              source={{ uri: `data:image/png;base64,${value.icon}` }}
              style={{
                height: 50,
                width: 50,
                borderRadius: 25
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                marginLeft: wp(2),
                marginRight: 'auto'
              }}>
              <Text allowFontScaling={false} style={styles.appName}>
                {makeDotWidth(value.appName, 20)}
              </Text>
              <Text allowFontScaling={false} style={styles.pkgName}>
                {makeDotWidth(value.packageName, 30)}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() => handleAppClick(value)}>
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.textBtn,
                  color:
                    refreshRate[value.packageName] &&
                    'color' in refreshRate[value.packageName]
                      ? refreshRate[value.packageName].color
                      : '#6A6A6A'
                }}>
                {handleRefreshRateString(value)}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ContentContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: wp(3),
    borderColor: '#DEDEDE',
    borderWidth: 1,
    marginBottom: hp(1.5),
    padding: wp(3),
    paddingLeft: wp(3),
    paddingRight: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  appName: {
    fontFamily: 'GothamRounded-Medium',
    fontSize: wp(3.5),
    color: '#000'
  },
  pkgName: {
    fontSize: wp(2.5),
    color: '#6A6A6A'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DEDEDE',
    padding: wp(3),
    paddingTop: wp(1),
    paddingBottom: wp(1),
    borderRadius: wp(5),
    width: wp(15)
  },
  textBtn: {
    fontFamily: 'GothamRounded-Medium',
    fontSize: wp(2.5)
  }
})
