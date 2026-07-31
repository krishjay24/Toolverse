import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { ToolScreenLayout } from "@/components/tools/ToolScreenLayout";
import { useToolTracking } from "@/hooks/useToolTracking";
import { spacing } from "@/theme";
import { copyToClipboard, showCopiedAlert } from "@/utils/clipboard";

// ── Pure-JS PNG pixel decoder ─────────────────────────────────────────────────
//
// This feature does NOT auto-capture in the background.
// It reads the center color only when the user taps Pause.

function rgbFromBase64Png(
  b64: string,
): { r: number; g: number; b: number } | null {
  try {
    const clean = b64.replace(/^data:[^;]+;base64,/, "");
    const bin = atob(clean);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    if (
      bytes[0] !== 0x89 ||
      bytes[1] !== 0x50 ||
      bytes[2] !== 0x4e ||
      bytes[3] !== 0x47
    ) {
      return null;
    }

    let colorType = 2;
    const idat: number[] = [];
    let off = 8;

    while (off + 12 <= bytes.length) {
      const len =
        ((bytes[off] << 24) |
          (bytes[off + 1] << 16) |
          (bytes[off + 2] << 8) |
          bytes[off + 3]) >>>
        0;
      const tag = String.fromCharCode(
        bytes[off + 4],
        bytes[off + 5],
        bytes[off + 6],
        bytes[off + 7],
      );

      if (tag === "IHDR") {
        colorType = bytes[off + 17];
      } else if (tag === "IDAT") {
        for (let i = 0; i < len; i++) idat.push(bytes[off + 8 + i]);
      } else if (tag === "IEND") {
        break;
      }

      off += 12 + len;
    }

    if (!idat.length) return null;

    const channels =
      colorType === 6 ? 4 : colorType === 4 ? 2 : colorType === 0 ? 1 : 3;

    const raw = zlibInflate(new Uint8Array(idat));
    if (!raw || raw.length < channels + 1) return null;

    if (channels === 1) return { r: raw[1], g: raw[1], b: raw[1] };
    return { r: raw[1], g: raw[2], b: raw[3] };
  } catch {
    return null;
  }
}

function zlibInflate(data: Uint8Array): Uint8Array | null {
  let bytePos = 2;
  let bitIndex = 0;
  const out: number[] = [];

  const bit = (): number => {
    if (bytePos >= data.length) return 0;
    const value = (data[bytePos] >> bitIndex) & 1;
    bitIndex += 1;
    if (bitIndex === 8) {
      bitIndex = 0;
      bytePos += 1;
    }
    return value;
  };

  const readBits = (count: number): number => {
    let value = 0;
    for (let i = 0; i < count; i++) value |= bit() << i;
    return value;
  };

  const byteAlign = (): void => {
    if (bitIndex > 0) {
      bitIndex = 0;
      bytePos += 1;
    }
  };

  const fixedSymbol = (): number => {
    let code = 0;
    for (let i = 6; i >= 0; i--) code |= bit() << i;

    if (code === 0) return 256;
    if (code <= 23) return 256 + code;

    code = (code << 1) | bit();
    if (code >= 48 && code <= 191) return code - 48;
    if (code >= 192 && code <= 199) return 280 + (code - 192);

    code = (code << 1) | bit();
    return code >= 400 && code <= 511 ? code - 256 : -1;
  };

  let isFinalBlock = 0;

  while (!isFinalBlock) {
    isFinalBlock = bit();
    const blockType = readBits(2);

    if (blockType === 0) {
      byteAlign();
      const len = readBits(16);
      readBits(16);
      for (let i = 0; i < len; i++) out.push(readBits(8));
    } else if (blockType === 1) {
      for (;;) {
        const symbol = fixedSymbol();
        if (symbol === 256 || symbol < 0) break;
        out.push(symbol);
        if (out.length >= 6) break;
      }
    } else {
      return null;
    }
  }

  return out.length ? new Uint8Array(out) : null;
}

type RGB = { r: number; g: number; b: number };

function toHex({ r, g, b }: RGB): string {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0").toUpperCase())
    .join("")}`;
}

const COMMON_COLORS: Array<{ name: string; rgb: RGB }> = [
  { name: "Black", rgb: { r: 0, g: 0, b: 0 } },
  { name: "White", rgb: { r: 255, g: 255, b: 255 } },
  { name: "Gray", rgb: { r: 128, g: 128, b: 128 } },
  { name: "Silver", rgb: { r: 192, g: 192, b: 192 } },
  { name: "Red", rgb: { r: 239, g: 68, b: 68 } },
  { name: "Orange", rgb: { r: 249, g: 115, b: 22 } },
  { name: "Yellow", rgb: { r: 234, g: 179, b: 8 } },
  { name: "Gold", rgb: { r: 245, g: 158, b: 11 } },
  { name: "Green", rgb: { r: 34, g: 197, b: 94 } },
  { name: "Lime", rgb: { r: 132, g: 204, b: 22 } },
  { name: "Blue", rgb: { r: 37, g: 99, b: 235 } },
  { name: "Navy", rgb: { r: 30, g: 64, b: 175 } },
  { name: "Cyan", rgb: { r: 6, g: 182, b: 212 } },
  { name: "Teal", rgb: { r: 20, g: 184, b: 166 } },
  { name: "Purple", rgb: { r: 147, g: 51, b: 234 } },
  { name: "Pink", rgb: { r: 236, g: 72, b: 153 } },
  { name: "Brown", rgb: { r: 120, g: 73, b: 51 } },
];

function getClosestColorName(rgb: RGB): string {
  let closest = COMMON_COLORS[0];
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const color of COMMON_COLORS) {
    const redDistance = rgb.r - color.rgb.r;
    const greenDistance = rgb.g - color.rgb.g;
    const blueDistance = rgb.b - color.rgb.b;
    const distance =
      redDistance * redDistance +
      greenDistance * greenDistance +
      blueDistance * blueDistance;

    if (distance < closestDistance) {
      closest = color;
      closestDistance = distance;
    }
  }

  return closest.name;
}

export function ColorPickerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [currentColor, setCurrentColor] = useState<RGB | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSampling, setIsSampling] = useState(false);
  const [error, setError] = useState("");

  const cameraRef = useRef<CameraView>(null);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);

  const trackAction = useToolTracking("color-picker");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const readCenterColor = useCallback(async () => {
    if (!cameraRef.current || isProcessingRef.current) return;

    isProcessingRef.current = true;
    setIsSampling(true);
    setError("");

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.2,
        skipProcessing: true,
      });

      if (!photo) throw new Error("No photo returned");

      const cropSize = Math.min(15, photo.width, photo.height);
      const originX = Math.max(0, Math.floor((photo.width - cropSize) / 2));
      const originY = Math.max(0, Math.floor((photo.height - cropSize) / 2));

      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX,
              originY,
              width: cropSize,
              height: cropSize,
            },
          },
          { resize: { width: 1, height: 1 } },
        ],
        {
          format: ImageManipulator.SaveFormat.PNG,
          base64: true,
        },
      );

      const rgb = manipulated.base64
        ? rgbFromBase64Png(manipulated.base64)
        : null;

      if (!rgb) throw new Error("Could not decode color from image");

      if (isMountedRef.current) {
        setCurrentColor(rgb);
      }
    } catch {
      if (isMountedRef.current) {
        setError("Could not read color. Hold steady and try again.");
      }
    } finally {
      isProcessingRef.current = false;
      if (isMountedRef.current) {
        setIsSampling(false);
      }
    }
  }, []);

  const handleTogglePause = async () => {
    setError("");

    if (isPaused) {
      setIsPaused(false);
      return;
    }

    await readCenterColor();
    if (isMountedRef.current) {
      setIsPaused(true);
    }
  };

  const handleCopyCurrentColor = async () => {
    if (!currentColor) return;

    const hex = toHex(currentColor);
    const name = getClosestColorName(currentColor);
    const text = `${hex} | RGB: ${currentColor.r}, ${currentColor.g}, ${currentColor.b} | ${name}`;

    if (await copyToClipboard(text)) {
      showCopiedAlert();
      trackAction(`Copied ${hex}`);
    }
  };

  if (!permission) {
    return (
      <ToolScreenLayout title="Color Picker">
        <EmptyState
          icon="eyedrop-outline"
          title="Checking camera"
          description="Verifying permissions..."
        />
      </ToolScreenLayout>
    );
  }

  if (!permission.granted) {
    return (
      <ToolScreenLayout title="Color Picker">
        <EmptyState
          icon="eyedrop-outline"
          title="Camera access needed"
          description="Allow camera access to pick colors from real-world objects."
          actionTitle="Grant permission"
          onAction={requestPermission}
        />
      </ToolScreenLayout>
    );
  }

  const hex = currentColor ? toHex(currentColor) : "#FFFFFF";
  const colorName = currentColor ? getClosestColorName(currentColor) : "Ready";

  return (
    <View style={styles.screen}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
      />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.crosshairWrap}>
          <View style={styles.crosshairRing} />
          <View style={styles.crosshairDot} />
        </View>
      </View>

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          style={styles.circleBtn}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(tabs)/home")
          }
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.topTitle}>Color Picker</Text>

        <View style={styles.circleBtnPlaceholder} />
      </View>

      <View style={[styles.floatingResultCard, { bottom: insets.bottom + 86 }]}>
        <View style={[styles.colorCircle, { backgroundColor: hex }]} />

        <View style={styles.colorValues}>
          <Text style={styles.colorName}>{colorName}</Text>

          <Text style={styles.hexText}>
            {currentColor ? hex : "No color picked"}
          </Text>

          <Text style={styles.rgbText}>
            {currentColor
              ? `RGB: ${currentColor.r}, ${currentColor.g}, ${currentColor.b}`
              : "Move camera, then tap pause to pick"}
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Pressable
          style={[
            styles.iconActionBtn,
            !currentColor && styles.iconActionBtnDisabled,
          ]}
          onPress={handleCopyCurrentColor}
          disabled={!currentColor}
        >
          <Ionicons name="copy-outline" size={23} color="#FFFFFF" />
        </Pressable>

        <Pressable
          style={[styles.iconActionBtn, isSampling && styles.iconActionBtnDisabled]}
          onPress={handleTogglePause}
          disabled={isSampling}
        >
          {isSampling ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isPaused ? "play" : "pause"}
              size={23}
              color="#FFFFFF"
            />
          )}
        </Pressable>
      </View>

      <View style={[styles.statusPill, { bottom: insets.bottom + 26 }]}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isPaused
                ? "#F59E0B"
                : isSampling
                  ? "#22C55E"
                  : "#94A3B8",
            },
          ]}
        />
        <Text style={styles.statusText}>
          {isPaused
            ? "Paused — color locked"
            : isSampling
              ? "Reading center color..."
              : "Move camera, then pause to pick color"}
        </Text>
      </View>
    </View>
  );
}

const CIRCLE_BUTTON_SIZE = 44;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
  },
  circleBtn: {
    width: CIRCLE_BUTTON_SIZE,
    height: CIRCLE_BUTTON_SIZE,
    borderRadius: CIRCLE_BUTTON_SIZE / 2,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  circleBtnPlaceholder: {
    width: CIRCLE_BUTTON_SIZE,
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  crosshairWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  crosshairRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
  },
  crosshairDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  floatingResultCard: {
    position: "absolute",
    left: spacing.base,
    right: spacing.base,
    minHeight: 86,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.88)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  colorCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  colorValues: {
    flex: 1,
    minWidth: 0,
  },
  colorName: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.68)",
    marginBottom: 2,
  },
  hexText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  rgbText: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.62)",
  },
  errorText: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "600",
    color: "#FCA5A5",
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  iconActionBtnDisabled: {
    opacity: 0.45,
  },
  statusPill: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.62)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
