package com.autohertz.jersnet.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import javax.annotation.Nonnull;
import android.content.Intent;
import android.content.ContentResolver;
import android.provider.Settings;
import android.app.Activity;
import android.content.Context;
import android.content.ComponentName;
import android.text.TextUtils;

import java.util.List;
import java.util.Iterator;
import java.lang.Class;

import com.autohertz.jersnet.service.WindowAccessibilityService;

public class BackgroundService extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public BackgroundService(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
  
    @Nonnull
    @Override
    public String getName() {
        return "BackgroundService";
    }

    @ReactMethod
    public void getSystemIntValues(String key, Promise promise) {
        try {
            int value = Settings.System.getInt(this.reactContext.getContentResolver(), key);
            promise.resolve(value);
        } catch(Exception ex) {
            promise.reject(ex);
        }
    }

    @ReactMethod
    public void openAccessbilitySettings(Promise promise) {
        Activity currentActivity = getCurrentActivity();

        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            currentActivity.startActivity(intent);
            promise.resolve("Accessbility settings opened");
        } catch(Exception ex) {
            promise.reject(ex);
        }
    }

    @ReactMethod
    public void isAccessibilityServiceEnabledByUser(Promise promise) {
        try {
            boolean result = isAccessibilityServiceEnabled(WindowAccessibilityService.class);
            promise.resolve(result);
        } catch(Exception ex) {
            promise.reject(ex);
        }
    }

    private boolean isAccessibilityServiceEnabled(Class<?> accessibilityService) {
        ComponentName expectedComponentName = new ComponentName(this.reactContext, accessibilityService);

        String enabledServicesSetting = Settings.Secure.getString(
            this.reactContext.getContentResolver(),  
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        );

        if (enabledServicesSetting == null)
            return false;

        TextUtils.SimpleStringSplitter colonSplitter = new TextUtils.SimpleStringSplitter(':');
        colonSplitter.setString(enabledServicesSetting);

        while (colonSplitter.hasNext()) {
            String componentNameString = colonSplitter.next();
            ComponentName enabledService = ComponentName.unflattenFromString(componentNameString);

            if (enabledService != null && enabledService.equals(expectedComponentName))
                return true;
        }

        return false;
    }
}