<template>
  <div>
    <Splitpanes
      class="main-frame"
      horizontal
      :dbl-click-splitter="false"
      @resize="onResizeMain"
      @resized="onResizedMain"
    >
      <Pane :size="topPaneHeightPercentage">
        <div class="full column">
          <div class="row">
            <BoardPane
              :style="boardPaneStyle"
              :max-size="boardPaneMaxSize"
              @resize="onBoardPaneResize"
            />
            <RecordPane v-show="isSmartphoneLayout" :style="recordPaneStyle" />
          </div>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup lang="ts">
import { t } from "@/common/i18n";
import { reactive, onMounted, onUnmounted, computed, ref } from "vue";
import BoardPane from "./BoardPane.vue";
import RecordPane, { minWidth as minRecordWidth } from "./RecordPane.vue";
import { headerHeight as tabHeaderHeight } from "./TabPane.vue";
import { RectSize } from "@/common/graphics";
import { AppSettingUpdate, Tab, TabPaneType } from "@/common/settings/app";
import api from "@/renderer/ipc/api";
import { LogLevel } from "@/common/log";
import { toString } from "@/common/helpers/string";
import { Lazy } from "@/renderer/helpers/lazy";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { useAppSetting } from "@/renderer/store/setting";
import { isNarrowDisplay } from "@/renderer/device/device";

const splitterWidth = 8;
const margin = 10;
const lazyUpdateDelay = 100;

const appSetting = useAppSetting();
const windowSize = reactive(new RectSize(window.innerWidth, window.innerHeight));
const topPaneHeightPercentage = ref(appSetting.topPaneHeightPercentage);
const boardPaneSize = reactive(new RectSize(0, 0));

const windowLazyUpdate = new Lazy();
const updateSize = () => {
  windowLazyUpdate.after(() => {
    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight;
  }, lazyUpdateDelay);
};

onMounted(() => {
  onMinimizeTab();
  window.addEventListener("resize", updateSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateSize);
});

const onBoardPaneResize = (size: RectSize) => {
  boardPaneSize.width = size.width;
  boardPaneSize.height = size.height;
};

const updateAppSetting = (update: AppSettingUpdate) => {
  appSetting.updateAppSetting(update).catch((e) => {
    api.log(LogLevel.WARN, "StandardLayout: failed to update app setting: " + toString(e));
  });
};

const onMinimizeTab = () => {
  topPaneHeightPercentage.value = 100;
  updateAppSetting({ topPaneHeightPercentage: 100 });
};

const mainLazyUpdate = new Lazy();
const onResizeMain = (panes: { size: number }[]) => {
  const newValue = panes[0].size;
  mainLazyUpdate.after(() => {
    topPaneHeightPercentage.value = newValue;
  }, lazyUpdateDelay);
};
const onResizedMain = (panes: { size: number }[]) => {
  mainLazyUpdate.clear();
  const newValue = panes[0].size;
  topPaneHeightPercentage.value = newValue;
  updateAppSetting({ topPaneHeightPercentage: newValue });
};

const isBottomPaneVisible = computed(() => {
  return (windowSize.height * bottomPaneHeightPercentage.value) / 100 >= tabHeaderHeight;
});

const isSmartphoneLayout = computed(() => {
  return !isNarrowDisplay();
});

const boardPaneMaxSize = computed(() => {
  if (isNarrowDisplay()) {
    return new RectSize(windowSize.width - splitterWidth - margin, windowSize.height);
  }

  return new RectSize(
    Math.max(windowSize.width - minRecordWidth - margin * 2, 0),
    Math.max(
      (windowSize.height - splitterWidth) * (topPaneHeightPercentage.value / 100) -
        margin * 2 -
        (isBottomPaneVisible.value ? 0 : tabHeaderHeight),
      0,
    ),
  );
});

const boardPaneStyle = computed(() => {
  return {
    margin: `${margin}px`,
  };
});

const recordPaneStyle = computed(() => {
  const width = windowSize.width - boardPaneSize.width - margin * 3;
  const height = boardPaneSize.height;
  return {
    margin: `${margin}px ${margin}px ${margin}px 0`,
    width: `${width}px`,
    height: `${height}px`,
  };
});

const bottomPaneHeightPercentage = computed(() => {
  return 100 - topPaneHeightPercentage.value;
});
</script>

<style>
.main-frame.splitpanes--horizontal > .splitpanes__splitter {
  height: 8px;
  cursor: ns-resize;
}
.bottom-frame.splitpanes--vertical > .splitpanes__splitter {
  width: 8px;
  cursor: ew-resize;
}
.main-frame .splitpanes__splitter {
  background-color: transparent;
}
.main-frame .splitpanes__splitter:hover {
  background-color: #1e90ff;
}
.bottom-frame.splitpanes--vertical > .splitpanes__pane {
  box-shadow: 6px 0px 6px -3px var(--shadow-color);
}
.footer {
  background-color: var(--main-bg-color);
}
</style>

<style scoped>
.unhide-tabview-button {
  width: 100%;
  height: 30px;
  font-size: 100%;
  text-align: center;
  line-height: 180%;
  padding: 0 5% 0 5%;
}
</style>
