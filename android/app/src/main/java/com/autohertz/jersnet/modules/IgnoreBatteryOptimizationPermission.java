package com.autohertz.jersnet.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ActivityEventListener;

import android.provider.Settings;
import android.os.Build;
import android.content.Intent;
import android.net.Uri;
import android.app.Activity;
import android.os.PowerManager;

public class IgnoreBatteryOptimizationPermission extends ReactContextBaseJavaModule implements ActivityEventListener {
    static final int IGNORE_BATTERY_OPTIMIZATION_REQUEST = 1204;

    private ReactApplicationContext reactContext;
    private Promise promise;

    public IgnoreBatteryOptimizationPermission(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
    }

    @ReactMethod
    public void isIgnoringBatteryOptimizations(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PowerManager pm = (PowerManager) currentActivity.getSystemService(currentActivity.POWER_SERVICE);
            promise.resolve(pm.isIgnoringBatteryOptimizations(this.reactContext.getPackageName()));
        } else {
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void requestToIgnoreBatteryOptimization(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        this.promise = promise;
        boolean isIgnoreBatteryOptimization = false;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PowerManager pm = (PowerManager) currentActivity.getSystemService(currentActivity.POWER_SERVICE);
            isIgnoreBatteryOptimization = pm.isIgnoringBatteryOptimizations(this.reactContext.getPackageName());

            if (!isIgnoreBatteryOptimization) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + this.reactContext.getPackageName()));
                currentActivity.startActivityForResult(intent, IGNORE_BATTERY_OPTIMIZATION_REQUEST);
            } else {
                this.promise.resolve(true);
            }
        } else {
            this.promise.resolve(false);
        }
    }

    @Override
    public String getName() {
        return "JersIgnoreBatteryOptimizationPermission";
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if(requestCode == IGNORE_BATTERY_OPTIMIZATION_REQUEST) {
            if(resultCode == Activity.RESULT_OK) {
                this.promise.resolve(true);
                return;
            } 
            
            this.promise.resolve(false);   
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // Nothing
    }
}