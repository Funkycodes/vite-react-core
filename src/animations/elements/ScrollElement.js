/**
 * Scroll Element
 *
 * Give tools to compute element progress in the viewport and triggers callbacks to animate it.
 *
 * Features functions to:
 *
 * - scrollClass - Add a custom class when the element is intersected by the offset
 * - scrollOffset - Determine offsets to intersect the element
 * - scrollPosition - Determine the element positions to consider an element as intersected.
 * - scrollModuleProgress - Send scroll progress to modular module that have a specific method (PROGRESS_MODULAR_METHOD)
 * - scrollCssProgress - Add a specific css variable (PROGRESS_CSS_VAR) that store the scroll progress
 * - scrollEventProgress - Send scroll progress to custom event listeners.
 * - scrollSpeed - Add a scroll multiplicator to create a parallax effect
 * - scrollRepeat - Repeat the option to trigger animation each time the element is intersected
 * - scrollCall - Call a custom event or a modular callback when the element is intersected
 */
import { clamp, closestNumber, normalize, mapRange } from '../utils/math';

/** Constants */
const INVIEW_CLASS = 'is-inview';
const PROGRESS_CSS_VAR = '--progress';
const PROGRESS_MODULAR_METHOD = 'onScrollProgress';

export default class ScrollElement {
  constructor ({
    $el,
    id,
    modularInstance,
    subscribeElementUpdateFn,
    unsubscribeElementUpdateFn,
    needRaf,
    scrollOrientation,
  }) {
    // Scroll DOM element
    this.$el = $el;
    console.log(this.$el);
    // Unique ID
    this.id = id;
    // RAF option
    this.needRaf = needRaf;
    // Scroll Direction
    this.scrollOrientation = scrollOrientation;
    // Modular.js
    this.modularInstance = modularInstance;
    // Parent's callbacks
    this.subscribeElementUpdateFn = subscribeElementUpdateFn;
    this.unsubscribeElementUpdateFn = unsubscribeElementUpdateFn;

    // Attributes
    this.attributes = {
      scrollClass: this.$el.dataset[ 'scrollClass' ] ?? INVIEW_CLASS,
      scrollOffset: this.$el.dataset[ 'scrollOffset' ] ?? '0,0',
      scrollPosition: this.$el.dataset[ 'scrollPosition' ] ?? 'start,end',
      scrollModuleProgress:
        this.$el.dataset[ 'scrollModuleProgress' ] != null,
      scrollCssProgress: this.$el.dataset[ 'scrollCssProgress' ] != null,
      scrollEventProgress:
        this.$el.dataset[ 'scrollEventProgress' ] ?? null,
      scrollSpeed:
        this.$el.dataset[ 'scrollSpeed' ] != null
          ? parseFloat(this.$el.dataset[ 'scrollSpeed' ])
          : null,
      scrollRepeat: this.$el.dataset[ 'scrollRepeat' ] != null,
      scrollCall: this.$el.dataset[ 'scrollCall' ] ?? null,
      scrollCallSelf: this.$el.dataset[ 'scrollCallSelf' ] != null,
      scrollIgnoreFold: this.$el.dataset[ 'scrollIgnoreFold' ] != null,
      scrollEnableTouchSpeed:
        this.$el.dataset[ 'scrollEnableTouchSpeed' ] != null,
    };

    // Limits
    this.intersection = {
      start: 0,
      end: 0,
    };

    // Metrics
    this.metrics = {
      offsetStart: 0,
      offsetEnd: 0,
      bcr: {},
    };

    // Scroll Values
    this.currentScroll =
      this.scrollOrientation === 'vertical'
        ? window.scrollY
        : window.scrollX;

    // Parallax
    this.translateValue = 0;

    // Progress
    this.progress = 0;
    this.lastProgress = null;
    this.progressModularModules = [];

    // Inview
    this.isInview = false;
    this.isInteractive = false;
    this.isAlreadyIntersected = false;
    this.isInFold = false;
    this.isFirstResize = true;

    // Init
    this.init();
  }

  /**
   * Lifecyle - Initialize progress tracking.
   *
   * @private
   */
  init() {
    if (!this.needRaf) {
      return;
    }

    // Prepare modules progress
    if (this.modularInstance && this.attributes.scrollModuleProgress) {
      this.getProgressModularModules();
    }

    // First resize to compute all values
    this.resize();
  }

  /**
   * Callback - Resize callback
   */
  onResize({ currentScroll }) {
    this.currentScroll = currentScroll;
    this.resize();
  }

  /**
   * Callback - RAF callback
   */
  onRender({ currentScroll, smooth }) {
    const wSize =
      this.scrollOrientation === 'vertical'
        ? window.innerHeight
        : window.innerWidth;
    this.currentScroll = currentScroll;
    this.computeProgress();

    // Parallax
    if (
      this.attributes.scrollSpeed &&
      !isNaN(this.attributes.scrollSpeed)
    ) {
      // if touch detected or smooth disabled
      if (!this.attributes.scrollEnableTouchSpeed && !smooth) {
        if (this.translateValue) {
          this.$el.style.transform = `translate3d(0, 0, 0)`;
        }
        this.translateValue = 0;

        // if mousewheel or smooth enabled
      } else {
        // Check fold condition
        if (this.isInFold) {
          const progress = Math.max(0, this.progress);
          this.translateValue =
            progress * wSize * this.attributes.scrollSpeed * -1;
        } else {
          const progress = mapRange(0, 1, this.progress, -1, 1);
          this.translateValue =
            progress * wSize * this.attributes.scrollSpeed * -1;
        }
        console.log(this.translateValue);
        console.log(this.scrollOrientation);
        this.$el.style.transform =
          this.scrollOrientation === 'vertical'
            ? `translate3d(0, ${this.translateValue}px, 0)`
            : `translate3d(${this.translateValue}px, 0, 0)`;
      }
    }
  }

  /**
   * Inview callback
   */
  setInview() {
    if (this.isInview) {
      return;
    }

    this.isInview = true;
    this.$el.classList.add(this.attributes.scrollClass);

    const way = 'enter';
    const from = this.getScrollCallFrom();
    this.attributes.scrollCall && this.dispatchCall(way, from);
  }

  /**
   * Out of view callback
   */
  setOutOfView() {
    if (!(this.isInview && this.attributes.scrollRepeat)) {
      return;
    }

    this.isInview = false;
    this.$el.classList.remove(this.attributes.scrollClass);

    const way = 'leave';
    const from = this.getScrollCallFrom();
    this.attributes.scrollCall && this.dispatchCall(way, from);
  }

  /**
   * Switch interactivity on to subscribe the instance to the RAF
   * and start calculations.
   */
  setInteractivityOn() {
    if (this.isInteractive) {
      return;
    }

    this.isInteractive = true;
    this.subscribeElementUpdateFn(this);
  }

  /**
   * Switch interactivity off to unsubscribe the instance to the RAF
   * and stop calculations.
   */
  setInteractivityOff() {
    if (!this.isInteractive) {
      return;
    }

    this.isInteractive = false;
    this.unsubscribeElementUpdateFn(this);

    // Force progress to progress limit when the element is out
    this.lastProgress != null &&
      this.computeProgress(closestNumber([ 0, 1 ], this.lastProgress));
  }

  /**
   * Resize method that compute the element's values.
   *
   * @private
   */
  resize() {
    this.metrics.bcr = this.$el.getBoundingClientRect();
    this.computeMetrics();
    this.computeIntersection();

    // First resize logic
    if (this.isFirstResize) {
      this.isFirstResize = false;
      // Dispatch default call if the element is in fold.
      if (this.isInFold) {
        this.setInview();
      }
    }
  }

  /**
   * Compute element's offsets and determine if the element is in fold.
   *
   * @private
   */
  computeMetrics() {
    const { top, left, height, width } = this.metrics.bcr;
    const wSize =
      this.scrollOrientation === 'vertical'
        ? window.innerHeight
        : window.innerWidth;
    const metricsStart = this.scrollOrientation === 'vertical' ? top : left;
    const metricsSize =
      this.scrollOrientation === 'vertical' ? height : width;

    this.metrics.offsetStart =
      this.currentScroll + metricsStart - this.translateValue;
    this.metrics.offsetEnd = this.metrics.offsetStart + metricsSize;

    if (
      this.metrics.offsetStart < wSize &&
      !this.attributes.scrollIgnoreFold
    ) {
      this.isInFold = true;
    } else {
      this.isInFold = false;
    }
  }

  /**
   * Compute intersection values depending on the context.
   *
   * @private
   */
  computeIntersection() {
    // Window size
    const wSize =
      this.scrollOrientation === 'vertical'
        ? window.innerHeight
        : window.innerWidth;

    // Metrics size
    const metricsSize =
      this.scrollOrientation === 'vertical'
        ? this.metrics.bcr.height
        : this.metrics.bcr.width;

    // Offset
    const offset = this.attributes.scrollOffset.split(',');
    const offsetStart = offset[ 0 ] != undefined ? offset[ 0 ].trim() : '0';
    const offsetEnd = offset[ 1 ] != undefined ? offset[ 1 ].trim() : '0';

    // Positions
    const scrollPosition = this.attributes.scrollPosition.split(',');
    let scrollPositionStart =
      scrollPosition[ 0 ] != undefined ? scrollPosition[ 0 ].trim() : 'start';
    const scrollPositionEnd =
      scrollPosition[ 1 ] != undefined ? scrollPosition[ 1 ].trim() : 'end';

    // Viewport
    const viewportStart = offsetStart.includes('%')
      ? wSize * parseInt(offsetStart.replace('%', '').trim()) * 0.01
      : parseInt(offsetStart);
    const viewportEnd = offsetEnd.includes('%')
      ? wSize * parseInt(offsetEnd.replace('%', '').trim()) * 0.01
      : parseInt(offsetEnd);

    // Fold exception
    if (this.isInFold) {
      scrollPositionStart = 'fold';
    }

    // Define Intersection Start
    switch (scrollPositionStart) {
      case 'start':
        this.intersection.start =
          this.metrics.offsetStart - wSize + viewportStart;
        break;

      case 'middle':
        this.intersection.start =
          this.metrics.offsetStart -
          wSize +
          viewportStart +
          metricsSize * 0.5;
        break;

      case 'end':
        this.intersection.start =
          this.metrics.offsetStart -
          wSize +
          viewportStart +
          metricsSize;
        break;

      case 'fold':
        this.intersection.start = 0;
        break;

      default:
        this.intersection.start =
          this.metrics.offsetStart - wSize + viewportStart;
        break;
    }

    // Define Intersection End
    switch (scrollPositionEnd) {
      case 'start':
        this.intersection.end = this.metrics.offsetStart - viewportEnd;
        break;

      case 'middle':
        this.intersection.end =
          this.metrics.offsetStart - viewportEnd + metricsSize * 0.5;
        break;

      case 'end':
        this.intersection.end =
          this.metrics.offsetStart - viewportEnd + metricsSize;
        break;

      default:
        this.intersection.end =
          this.metrics.offsetStart - viewportEnd + metricsSize;
        break;
    }

    // Avoid to have the end < the start intersection >
    if (this.intersection.end <= this.intersection.start) {
      switch (scrollPositionEnd) {
        case 'start':
          this.intersection.end = this.intersection.start + 1;
          break;

        case 'middle':
          this.intersection.end =
            this.intersection.start + metricsSize * 0.5;
          break;

        case 'end':
          this.intersection.end =
            this.intersection.start + metricsSize;
          break;

        default:
          this.intersection.end = this.intersection.start + 1;
          break;
      }
    }
  }

  /**
   * Compute the scroll progress of the element depending
   * on its intersection values.
   *
   * @private
   *
   * @param {number} [forcedProgress] - Value to force progress.
   */
  computeProgress(forcedProgress) {
    // Progress
    const progress =
      forcedProgress ??
      clamp(
        0,
        1,
        normalize(
          this.intersection.start,
          this.intersection.end,
          this.currentScroll
        )
      );

    this.progress = progress;

    if (progress != this.lastProgress) {
      this.lastProgress = progress;

      // Set the element's progress to the css variable
      this.attributes.scrollCssProgress && this.setCssProgress(progress);

      // Set the element's progress to the custom event listeners
      this.attributes.scrollEventProgress &&
        this.setCustomEventProgress(progress);

      // Set the element's progress to inline modules
      if (this.attributes.scrollModuleProgress) {
        for (const modularModules of this.progressModularModules) {
          this.modularInstance &&
            this.modularInstance.call(
              PROGRESS_MODULAR_METHOD,
              progress,
              modularModules.moduleName,
              modularModules.moduleId
            );
        }
      }

      // Logic to trigger the inview/out of view callbacks
      progress > 0 && progress < 1 && this.setInview();
      progress === 0 && this.setOutOfView();
      progress === 1 && this.setOutOfView();
    }
  }

  /**
   * Set the element's progress to a specific css variable.
   *
   * @private
   *
   * @param {number} [currentProgress] - Progress value.
   */
  setCssProgress(currentProgress = 0) {
    this.$el.style.setProperty(
      PROGRESS_CSS_VAR,
      currentProgress.toString()
    );
  }

  /**
   * Set the element's progress to the custom event listeners.
   *
   * @private
   *
   * @param {number} [currentProgress] - Progress value.
   */
  setCustomEventProgress(currentProgress = 0) {
    const customEventName = this.attributes.scrollEventProgress;

    if (!customEventName) return;

    const customEvent = new CustomEvent(customEventName, {
      detail: {
        target: this.$el,
        progress: currentProgress,
      },
    });
    window.dispatchEvent(customEvent);
  }

  /**
   * Get modular modules that can listen the element's progress.
   *
   * @private
   */
  getProgressModularModules() {
    if (!this.modularInstance) {
      return;
    }

    const modulesIdNames = Object.keys(this.$el.dataset).filter((key) =>
      key.includes('module')
    );
    const modules = Object.entries(this.modularInstance.modules);

    if (!modulesIdNames.length) {
      return;
    }

    for (const modulesIdName of modulesIdNames) {
      const moduleId = this.$el.dataset[ modulesIdName ];

      if (!moduleId) {
        return;
      }

      for (const module of modules) {
        const [ moduleName, moduleObj ] = module;

        if (moduleId in moduleObj) {
          this.progressModularModules.push({
            moduleName,
            moduleId,
          });
        }
      }
    }
  }

  /**
   * Function to get scroll call from.
   *
   * @private
   */
  getScrollCallFrom() {
    const closestIntersectionValue = closestNumber(
      [ this.intersection.start, this.intersection.end ],
      this.currentScroll
    );
    return this.intersection.start === closestIntersectionValue
      ? 'start'
      : 'end';
  }

  /**
   * Function to dispatch a custom event or call a modular callback.
   *
   * @private
   *
   * @param {scrollCallWay} way - Enter or leave.
   * @param {scrollCallFrom} from - Start or end.
   */
  dispatchCall(way, from) {
    const callParameters = this.attributes.scrollCall?.split(',');
    const callSelf = this.attributes?.scrollCallSelf;

    if (callParameters && callParameters.length > 1) {
      // Using Modular.js (https://github.com/modularorg/modularjs)
      const [ func, moduleName, moduleId ] = callParameters;
      let targetModuleId;

      // If the module is set on the scroll element
      if (callSelf) {
        targetModuleId = this.$el.dataset[ `module${moduleName.trim()}` ];
      } else {
        targetModuleId = moduleId;
      }

      this.modularInstance &&
        this.modularInstance.call(
          func.trim(),
          {
            target: this.$el,
            way,
            from,
          },
          moduleName.trim(),
          targetModuleId?.trim()
        );
    } else if (callParameters) {
      // Using CustomEvent API (https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
      const [ customEventName ] = callParameters;
      const customEvent = new CustomEvent(customEventName, {
        detail: {
          target: this.$el,
          way,
          from,
        },
      });
      window.dispatchEvent(customEvent);
    }
  }
}