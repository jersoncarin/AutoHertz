package com.autohertz.jersnet.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class SharePref {
    private static final String SHARED_PREF_FILE = "notification_prefs";

    public static boolean getBoolean(Context context, String key) {
        SharedPreferences prefs = context.getSharedPreferences(SHARED_PREF_FILE, Context.MODE_PRIVATE);
        return prefs.getBoolean(key, true);
    }

    public static void setBoolean(Context context, String key, boolean value) {
        SharedPreferences prefs = context.getSharedPreferences(SHARED_PREF_FILE, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putBoolean(key, value);
        editor.apply();
    }
}