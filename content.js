(() => {
  "use strict";

  const RECOMMENDED_KEYWORDS = ["おすすめ", "for you"];
  const FOLLOWING_KEYWORDS = ["フォロー中", "following"];

  function normalizeLabel(text) {
    return text.replace(/\s+/g, " ").trim().toLowerCase();
  }

  function includesKeyword(label, keywords) {
    return keywords.some((keyword) => label.includes(keyword));
  }

  function getTabLabel(tab) {
    const ariaLabel = tab.getAttribute("aria-label");
    if (ariaLabel) {
      return normalizeLabel(ariaLabel);
    }
    return normalizeLabel(tab.textContent || "");
  }

  function findTargetTabs(tablist) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

    let recommendedTab = null;
    let followingTab = null;

    for (const tab of tabs) {
      const label = getTabLabel(tab);

      if (!recommendedTab && includesKeyword(label, RECOMMENDED_KEYWORDS)) {
        recommendedTab = tab;
      }

      if (!followingTab && includesKeyword(label, FOLLOWING_KEYWORDS)) {
        followingTab = tab;
      }
    }

    return { tabs, recommendedTab, followingTab };
  }

  function findDirectChildOfTablist(tablist, tab) {
    if (!tablist || !tab) {
      return null;
    }

    let node = tab;
    while (node.parentElement && node.parentElement !== tablist) {
      node = node.parentElement;
    }

    if (!node.parentElement || node.parentElement !== tablist) {
      return null;
    }

    return node;
  }

  function hideTabSlot(tablist, tab) {
    if (!tab) {
      return;
    }

    const slot = findDirectChildOfTablist(tablist, tab);
    if (slot && slot !== tab) {
      slot.style.display = "none";
      slot.setAttribute("aria-hidden", "true");
    }

    tab.style.display = "none";
    tab.setAttribute("aria-hidden", "true");
    tab.setAttribute("tabindex", "-1");
  }

  function stretchFollowingTab(tablist, followingTab) {
    if (!followingTab) {
      return;
    }

    const slot = findDirectChildOfTablist(tablist, followingTab);
    if (slot) {
      slot.style.flex = "1 1 100%";
      slot.style.maxWidth = "100%";
      slot.style.width = "100%";
    }

    followingTab.style.flex = "1 1 100%";
    followingTab.style.maxWidth = "100%";
    followingTab.style.width = "100%";
  }

  function hideRecommendedTab() {
    const tablists = document.querySelectorAll('[role="tablist"]');

    for (const tablist of tablists) {
      const { tabs, recommendedTab, followingTab } = findTargetTabs(tablist);

      if (!recommendedTab || !followingTab) {
        continue;
      }

      if (recommendedTab.getAttribute("aria-selected") === "true") {
        followingTab.click();
      }

      hideTabSlot(tablist, recommendedTab);

      if (tabs.length === 2) {
        stretchFollowingTab(tablist, followingTab);
      }
    }
  }

  let scheduled = false;

  function scheduleUpdate() {
    if (scheduled) {
      return;
    }
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      hideRecommendedTab();
    });
  }

  function wrapHistoryMethod(methodName) {
    const original = history[methodName];
    if (typeof original !== "function") {
      return;
    }

    history[methodName] = function patchedHistoryMethod(...args) {
      const result = original.apply(this, args);
      scheduleUpdate();
      return result;
    };
  }

  function start() {
    hideRecommendedTab();

    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    wrapHistoryMethod("pushState");
    wrapHistoryMethod("replaceState");
    window.addEventListener("popstate", scheduleUpdate);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        scheduleUpdate();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
