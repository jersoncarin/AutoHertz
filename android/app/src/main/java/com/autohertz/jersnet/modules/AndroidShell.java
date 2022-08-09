package com.autohertz.jersnet.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.InputStream;
import java.lang.InterruptedException;


public class AndroidShell extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public AndroidShell(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "JersAndroidShell";
    }

    @ReactMethod
    public void executeCommand(final String command, final Promise promise) {
        // To avoid UI freezes run in thread 
        new Thread(new Runnable() { 
            public void run() { 
                OutputStream out = null; 
                InputStream in = null; 
                try { 
                    // Send script into runtime process 
                    Process child = Runtime.getRuntime().exec(command);
                    // Get input and output streams 
                    out = child.getOutputStream(); 
                    in = child.getInputStream();
                    // Input stream can return anything
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(in)); 
                    String line; 
                    String result = ""; 
                    while ((line = bufferedReader.readLine()) != null)
                        result += line+"\n";

                    child.waitFor();
                    // Handle input stream returned message
                    promise.resolve(result);
                } catch (IOException e) { 
                    e.printStackTrace(); 
                    promise.reject(e);
                }  catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    promise.reject(e);
                } finally { 
                    if (in != null) { 
                        try { 
                            in.close(); 
                        } catch (IOException e) { 
                            e.printStackTrace(); 
                        } 
                    } 
                    if (out != null) { 
                        try { 
                            out.flush(); 
                            out.close(); 
                        } catch (IOException e) { 
                            e.printStackTrace(); 
                        } 
                    } 
                } 
            } 
        }).start(); 
    }
}