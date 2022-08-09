import React from 'react'
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LoadinIndicator from './LoadingIndicator'
import { useEffect, useState } from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import NoDataIcon from './NoDataIcon'
import { accentColor } from '../config/color'

type Props = {
  children: any
  loading?: boolean
  handleSearch?: (text: string) => void
  refreshing?: boolean
  onRefresh?: () => void
  noData?: boolean
  headerTitle?: string
  subHeaderTitle?: string
  onScrollAtBottom?: (event: any) => void
  onScrollAtTop?: (event: any) => void
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onMomentomScrollAtBottom?: (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => void
  isAnimatingBottomIndicator?: boolean
  scrollRef?: any
  rootViewRef?: any
  noHeader?: boolean
  onFilterClick?: (filter: boolean) => void
}

export default function ContentContainer({
  children,
  loading,
  handleSearch,
  refreshing,
  onRefresh,
  noData,
  headerTitle,
  subHeaderTitle,
  onScrollAtBottom,
  onScrollAtTop,
  onScroll,
  scrollRef,
  isAnimatingBottomIndicator = false,
  onMomentomScrollAtBottom,
  rootViewRef,
  noHeader,
  onFilterClick
}: Props): JSX.Element {
  const [search, setSearch] = useState<string>('')
  const [filterOff, setFilterOff] = useState<boolean>(false)

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize
  }: any) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
  }

  const handleScroll = (event: any) => {
    if (isCloseToBottom(event.nativeEvent) && onScrollAtBottom) {
      onScrollAtBottom(event)
    }

    if (event.nativeEvent.contentOffset.y === 0 && onScrollAtTop) {
      onScrollAtTop(event)
    }
  }

  useEffect(() => {
    if (handleSearch) {
      handleSearch(search)
    }
  }, [search])

  return (
    <View ref={rootViewRef} style={styles.container}>
      {!noHeader && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <View>
            <Text allowFontScaling={false} style={styles.headerText}>
              {headerTitle}
            </Text>
            {subHeaderTitle && (
              <Text allowFontScaling={false} style={styles.subHeaderText}>
                {subHeaderTitle}
              </Text>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => {
              if (onFilterClick) {
                onFilterClick(filterOff)
              }
              setFilterOff(!filterOff)
            }}>
            <MaterialCommunityIcons
              name={filterOff ? 'filter-off-outline' : 'filter-outline'}
              size={35}
              color="black"
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        <AntDesign name="search1" size={30} color="black" />
        <TextInput
          allowFontScaling={false}
          selectionColor={accentColor}
          placeholder="Search Here..."
          placeholderTextColor={'#777777'}
          returnKeyType="go"
          style={styles.input}
          value={search}
          onChangeText={(text: string) => setSearch(text)}
        />
      </View>
      {loading ? (
        <View style={{ ...styles.content, ...styles.indicatorContainer }}>
          <LoadinIndicator />
        </View>
      ) : (
        <ScrollView
          onMomentumScrollEnd={onMomentomScrollAtBottom}
          ref={scrollRef}
          onScroll={event => {
            handleScroll(event)
            if (onScroll) {
              onScroll(event)
            }
          }}
          refreshControl={
            <RefreshControl
              colors={[accentColor]}
              refreshing={!!refreshing}
              onRefresh={onRefresh}
            />
          }
          style={{ ...styles.content, marginTop: hp(1) }}
          contentContainerStyle={
            noData
              ? {
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              : {}
          }>
          {noData ? (
            <View style={styles.dataContainer}>
              <View style={styles.mainIcon}>
                <NoDataIcon />
              </View>
              <Text allowFontScaling={false} style={styles.noDataText}>
                No Apps Available.
              </Text>
            </View>
          ) : (
            <>
              {children}
              <ActivityIndicator
                animating={isAnimatingBottomIndicator}
                size={45}
                color={accentColor}
              />
            </>
          )}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingLeft: wp(4),
    paddingRight: wp(4)
  },
  headerText: {
    fontFamily: 'GothamRounded-Bold',
    fontSize: wp(5.5),
    color: '#000'
  },
  subHeaderText: {
    marginTop: hp(0.2),
    fontFamily: 'GothamRounded-Book',
    fontSize: wp(3.5),
    color: '#6A6A6A'
  },
  inputContainer: {
    borderRadius: wp(3),
    backgroundColor: '#DEDEDE',
    height: hp(6),
    marginTop: hp(1.5),
    paddingLeft: wp(3),
    paddingRight: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  input: {
    fontFamily: 'GothamRounded-Book',
    fontSize: wp(4),
    marginLeft: wp(3),
    flex: 1
  },
  content: {
    flex: 1
  },
  indicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainIcon: {
    alignItems: 'center',
    aspectRatio: 1,
    height: hp(30),
    width: wp(30)
  },
  dataContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  noDataText: {
    marginTop: hp(3),
    fontFamily: 'GothamRounded-Bold',
    fontSize: wp(4.5),
    color: '#606060'
  }
})
