package com.autohertz.jersnet.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

import android.view.Display;
import android.provider.Settings;
import android.app.Activity;

public class GetDisplay extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public GetDisplay(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "JersGetDisplay";
  }

  @ReactMethod
  public void refreshRate(Promise promise) {
    Activity currentActivity = getCurrentActivity();

    try {
      Display display = currentActivity.getDisplay();
      promise.resolve((double) display.getRefreshRate());
    } catch (Exception ex) {
      promise.reject(ex);
    }
  }

  @ReactMethod
  public void minRefreshRate(Promise promise) {
    try {
      promise.resolve(Settings.System.getInt(this.reactContext.getContentResolver(), "min_refresh_rate"));
    } catch (Exception ex) {
      promise.reject(ex);
    }
  }

  @ReactMethod
  public void maxRefreshRate(Promise promise) {
    try {
      promise.resolve(Settings.System.getInt(this.reactContext.getContentResolver(), "peak_refresh_rate"));
    } catch (Exception ex) {
      promise.reject(ex);
    }
  }

  @ReactMethod
  public void refreshRates(Promise promise) {
    Activity currentActivity = getCurrentActivity();
    try {
      Display display = currentActivity.getDisplay();

      // Get the supported modes of display
      Display.Mode[] modes = display.getSupportedModes();
      WritableArray list = Arguments.createArray();

      for (Display.Mode mode : modes) {
        WritableMap appInfo = Arguments.createMap();
        float refreshRate = mode.getRefreshRate();
        appInfo.putDouble("value", (double) refreshRate);
        list.pushMap(appInfo);
      }

      promise.resolve(list);
    } catch (Exception ex) {
      promise.reject(ex);
    }
  }
}