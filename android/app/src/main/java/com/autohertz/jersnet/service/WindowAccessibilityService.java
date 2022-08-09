package com.autohertz.jersnet.service;

import android.accessibilityservice.AccessibilityService;
import android.view.accessibility.AccessibilityEvent;
import com.facebook.react.HeadlessJsTaskService;
import android.content.Intent;
import android.content.Context;
import com.autohertz.MainApplication;

public class WindowAccessibilityService extends AccessibilityService {

    @Override
    public void onAccessibilityEvent(AccessibilityEvent accessibilityEvent) {
        Context mainContext = MainApplication.getMainContext();

        if (accessibilityEvent.getEventType() == AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED 
            && mainContext.getPackageName().toString() != accessibilityEvent.getPackageName().toString()
        ) {
            Context context = getApplicationContext();
            Intent intent = new Intent(context, BackgroundEventTask.class);
            intent.putExtra("package_name", accessibilityEvent.getPackageName().toString());
            context.startService(intent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
        }
    }

    @Override
    public void onInterrupt() {
        // Interrupt 
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
    }
}