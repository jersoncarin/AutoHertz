package com.autohertz.jersnet;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.autohertz.jersnet.modules.IgnoreBatteryOptimizationPermission;
import com.autohertz.jersnet.modules.BackgroundService;
import com.autohertz.jersnet.modules.GetApplication;
import com.autohertz.jersnet.modules.GetDisplay;
import com.autohertz.jersnet.modules.AndroidShell;

public class MainPackage implements ReactPackage {

   @Override
   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
       return Collections.emptyList();
   }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        // Add the permission
        modules.add(new IgnoreBatteryOptimizationPermission(reactContext));
        modules.add(new BackgroundService(reactContext));
        modules.add(new GetApplication(reactContext));
        modules.add(new GetDisplay(reactContext));
        modules.add(new AndroidShell(reactContext));

        return modules;
    }

}