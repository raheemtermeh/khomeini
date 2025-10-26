// دیباگ برای محیط لوکال
export const debug = {
  // همیشه لاگ کن در محیط توسعه
  log: (...args: any[]) => {
    console.log("🔧 [DEBUG]", ...args);
  },
  error: (...args: any[]) => {
    console.error("❌ [DEBUG]", ...args);
  },
  warn: (...args: any[]) => {
    console.warn("⚠️ [DEBUG]", ...args);
  },
  info: (...args: any[]) => {
    console.info("ℹ️ [DEBUG]", ...args);
  },

  // فقط در حالت دیباگ پیشرفته
  verbose: (...args: any[]) => {
    if (localStorage.getItem("verbose-debug") === "true") {
      console.log("📖 [VERBOSE]", ...args);
    }
  },
};

// فعال کردن از طریق کنسول مرورگر
declare global {
  interface Window {
    enableDebug: () => void;
    disableDebug: () => void;
    enableVerbose: () => void;
    disableVerbose: () => void;
  }
}

window.enableDebug = () => {
  console.log("✅ Debug mode enabled");
};

window.disableDebug = () => {
  console.log("❌ Debug mode disabled");
};

window.enableVerbose = () => {
  localStorage.setItem("verbose-debug", "true");
  console.log("📖 Verbose debug enabled - reloading...");
  window.location.reload();
};

window.disableVerbose = () => {
  localStorage.removeItem("verbose-debug");
  console.log("📖 Verbose debug disabled - reloading...");
  window.location.reload();
};

// وضعیت اولیه
console.log("🔧 Debug utilities loaded");
console.log("💡 Use enableVerbose()/disableVerbose() in console for more logs");
