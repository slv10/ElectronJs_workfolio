package in.railworld.app.controller;

import org.jnativehook.GlobalScreen;
import org.jnativehook.NativeHookException;
import org.jnativehook.keyboard.NativeKeyEvent;
import org.jnativehook.keyboard.NativeKeyListener;
import org.jnativehook.mouse.NativeMouseEvent;
import org.jnativehook.mouse.NativeMouseInputListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Stopwatch;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class KeyboardMouseScreenshotMonitor {

    private static final Logger logger = LoggerFactory.getLogger(KeyboardMouseScreenshotMonitor.class);
    private static Stopwatch stopwatch = Stopwatch.createUnstarted();
    private static long totalElapsedTime = 0;
    private static int screenshotCounter = 1;


    public static void main(String[] args) {
        try {
            GlobalScreen.registerNativeHook();
        } catch (NativeHookException e) {
            logger.error("Failed to register native hook", e);
            return;
        }

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                GlobalScreen.unregisterNativeHook();
            } catch (NativeHookException e) {
                logger.error("Failed to unregister native hook", e);
            }
        }));

        GlobalScreen.addNativeKeyListener(new NativeKeyListener() {
            @Override
            public void nativeKeyPressed(NativeKeyEvent e) {
                logger.info("Keyboard key pressed: " + NativeKeyEvent.getKeyText(e.getKeyCode()));
                startStopwatch();
            }

            @Override
            public void nativeKeyReleased(NativeKeyEvent e) {
            }

            @Override
            public void nativeKeyTyped(NativeKeyEvent e) {
            }
        });

        GlobalScreen.addNativeMouseMotionListener(new NativeMouseInputListener() {
            @Override
            public void nativeMouseMoved(NativeMouseEvent e) {
                logger.info("Mouse moved at X: " + e.getX() + ", Y: " + e.getY());
                startStopwatch();
            }

            @Override
            public void nativeMouseDragged(NativeMouseEvent e) {
            }

            @Override
            public void nativeMouseClicked(NativeMouseEvent e) {
            }

            @Override
            public void nativeMousePressed(NativeMouseEvent e) {
                // Implement this method if needed
            }

            @Override
            public void nativeMouseReleased(NativeMouseEvent e) {
            }
        });
    }

    private static void startStopwatch() {
        if (!stopwatch.isRunning()) {
            stopwatch.start();
            logger.info("Stopwatch started");

            new java.util.Timer().schedule(
                    new java.util.TimerTask() {
                        @Override
                        public void run() {
                            stopStopwatch();
                            captureScreenshot();
                        }
                    },
                    TimeUnit.SECONDS.toMillis(5)
            );
        }
    }

    private static void stopStopwatch() {
        if (stopwatch.isRunning()) {
            stopwatch.stop();
            totalElapsedTime += stopwatch.elapsed(TimeUnit.MILLISECONDS);
            logger.info("Stopwatch stopped. Elapsed time: " + stopwatch);
            logger.info("Total elapsed time: " + totalElapsedTime + " ms");
            stopwatch.reset(); // Reset stopwatch
        }
    }

    private static void captureScreenshot() {
        try {
            Robot robot = new Robot();
            Rectangle screenRect = new Rectangle(Toolkit.getDefaultToolkit().getScreenSize());
            BufferedImage screenshot = robot.createScreenCapture(screenRect);

            File outputFile = new File("screenshot" + screenshotCounter + ".jpg");
            ImageIO.write(screenshot, "png", outputFile);

            ++screenshotCounter;

            logger.info("Screenshot captured and saved to: " + outputFile.getAbsolutePath());
        } catch (AWTException | IOException e) {
            logger.error("Failed to capture screenshot", e);
        }
    }
}
