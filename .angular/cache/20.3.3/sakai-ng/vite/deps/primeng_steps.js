import {
  Tooltip,
  TooltipModule
} from "./chunk-TH5HZZUV.js";
import "./chunk-P5652PBR.js";
import "./chunk-WS3AEYWX.js";
import {
  BaseComponent
} from "./chunk-5DDOTM24.js";
import {
  BaseStyle
} from "./chunk-2BN4WN7Y.js";
import "./chunk-7NI4C57H.js";
import {
  SharedModule
} from "./chunk-T3KH32J2.js";
import {
  Y2 as Y,
  z2 as z
} from "./chunk-MSBUF645.js";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule
} from "./chunk-VIYBDAF6.js";
import "./chunk-QNSOOWQ6.js";
import "./chunk-TF3W3NHY.js";
import "./chunk-COSCOCAW.js";
import {
  CommonModule,
  NgIf,
  NgStyle
} from "./chunk-YG47VFKR.js";
import "./chunk-4X6VR2I6.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-YO6GPXUM.js";
import "./chunk-JRFR6BLO.js";
import "./chunk-HWYXSU2G.js";
import "./chunk-MARUHEWW.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@primeuix/styles/dist/steps/index.mjs
var style = "\n    .p-steps {\n        position: relative;\n    }\n\n    .p-steps-list {\n        padding: 0;\n        margin: 0;\n        list-style-type: none;\n        display: flex;\n    }\n\n    .p-steps-item {\n        position: relative;\n        display: flex;\n        justify-content: center;\n        flex: 1 1 auto;\n    }\n\n    .p-steps-item.p-disabled,\n    .p-steps-item.p-disabled * {\n        opacity: 1;\n        pointer-events: auto;\n        user-select: auto;\n        cursor: auto;\n    }\n\n    .p-steps-item:before {\n        content: ' ';\n        border-top: 2px solid dt('steps.separator.background');\n        width: 100%;\n        top: 50%;\n        left: 0;\n        display: block;\n        position: absolute;\n        margin-top: calc(-1rem + 1px);\n    }\n\n    .p-steps-item:first-child::before {\n        width: calc(50% + 1rem);\n        transform: translateX(100%);\n    }\n\n    .p-steps-item:last-child::before {\n        width: 50%;\n    }\n\n    .p-steps-item-link {\n        display: inline-flex;\n        flex-direction: column;\n        align-items: center;\n        overflow: hidden;\n        text-decoration: none;\n        transition:\n            outline-color dt('steps.transition.duration'),\n            box-shadow dt('steps.transition.duration');\n        border-radius: dt('steps.item.link.border.radius');\n        outline-color: transparent;\n        gap: dt('steps.item.link.gap');\n    }\n\n    .p-steps-item-link:not(.p-disabled):focus-visible {\n        box-shadow: dt('steps.item.link.focus.ring.shadow');\n        outline: dt('steps.item.link.focus.ring.width') dt('steps.item.link.focus.ring.style') dt('steps.item.link.focus.ring.color');\n        outline-offset: dt('steps.item.link.focus.ring.offset');\n    }\n\n    .p-steps-item-label {\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        max-width: 100%;\n        color: dt('steps.item.label.color');\n        display: block;\n        font-weight: dt('steps.item.label.font.weight');\n    }\n\n    .p-steps-item-number {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        color: dt('steps.item.number.color');\n        border: 2px solid dt('steps.item.number.border.color');\n        background: dt('steps.item.number.background');\n        min-width: dt('steps.item.number.size');\n        height: dt('steps.item.number.size');\n        line-height: dt('steps.item.number.size');\n        font-size: dt('steps.item.number.font.size');\n        z-index: 1;\n        border-radius: dt('steps.item.number.border.radius');\n        position: relative;\n        font-weight: dt('steps.item.number.font.weight');\n    }\n\n    .p-steps-item-number::after {\n        content: ' ';\n        position: absolute;\n        width: 100%;\n        height: 100%;\n        border-radius: dt('steps.item.number.border.radius');\n        box-shadow: dt('steps.item.number.shadow');\n    }\n\n    .p-steps:not(.p-readonly) .p-steps-item {\n        cursor: pointer;\n    }\n\n    .p-steps-item-active .p-steps-item-number {\n        background: dt('steps.item.number.active.background');\n        border-color: dt('steps.item.number.active.border.color');\n        color: dt('steps.item.number.active.color');\n    }\n\n    .p-steps-item-active .p-steps-item-label {\n        color: dt('steps.item.label.active.color');\n    }\n";

// node_modules/primeng/fesm2022/primeng-steps.mjs
var _c0 = ["list"];
var _c1 = (a0, a1) => ({
  item: a0,
  index: a1
});
var _c2 = () => ({
  exact: false
});
var _forTrack0 = ($index, $item) => $item.label;
function Steps_For_4_li_0_a_2_span_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span");
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext(3).$implicit;
    const ctx_r4 = ɵɵnextContext();
    ɵɵclassMap(ctx_r4.cx("itemLabel"));
    ɵɵadvance();
    ɵɵtextInterpolate(item_r3.label);
  }
}
function Steps_For_4_li_0_a_2_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 12);
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext(3).$implicit;
    const ctx_r4 = ɵɵnextContext();
    ɵɵclassMap(ctx_r4.cx("itemLabel"));
    ɵɵproperty("innerHTML", item_r3.label, ɵɵsanitizeHtml);
  }
}
function Steps_For_4_li_0_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "a", 10);
    ɵɵlistener("click", function Steps_For_4_li_0_a_2_Template_a_click_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext(2);
      const item_r3 = ctx_r1.$implicit;
      const ɵ$index_5_r4 = ctx_r1.$index;
      const ctx_r4 = ɵɵnextContext();
      return ɵɵresetView(ctx_r4.onItemClick($event, item_r3, ɵ$index_5_r4));
    })("keydown", function Steps_For_4_li_0_a_2_Template_a_keydown_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext(2);
      const item_r3 = ctx_r1.$implicit;
      const ɵ$index_5_r4 = ctx_r1.$index;
      const ctx_r4 = ɵɵnextContext();
      return ɵɵresetView(ctx_r4.onItemKeydown($event, item_r3, ɵ$index_5_r4));
    });
    ɵɵelementStart(1, "span");
    ɵɵtext(2);
    ɵɵelementEnd();
    ɵɵtemplate(3, Steps_For_4_li_0_a_2_span_3_Template, 2, 3, "span", 11)(4, Steps_For_4_li_0_a_2_ng_template_4_Template, 1, 3, "ng-template", null, 3, ɵɵtemplateRefExtractor);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const htmlLabel_r6 = ɵɵreference(5);
    const ctx_r1 = ɵɵnextContext(2);
    const item_r3 = ctx_r1.$implicit;
    const ɵ$index_5_r4 = ctx_r1.$index;
    const ctx_r4 = ɵɵnextContext();
    ɵɵclassMap(ctx_r4.cx("itemLink"));
    ɵɵproperty("routerLink", item_r3.routerLink)("queryParams", item_r3.queryParams)("routerLinkActiveOptions", item_r3.routerLinkActiveOptions || ɵɵpureFunction0(21, _c2))("target", item_r3.target)("fragment", item_r3.fragment)("queryParamsHandling", item_r3.queryParamsHandling)("preserveFragment", item_r3.preserveFragment)("skipLocationChange", item_r3.skipLocationChange)("replaceUrl", item_r3.replaceUrl)("state", item_r3.state);
    ɵɵattribute("tabindex", ctx_r4.getItemTabIndex(item_r3, ɵ$index_5_r4))("aria-expanded", ɵ$index_5_r4 === ctx_r4.activeIndex)("aria-disabled", item_r3.disabled || ctx_r4.readonly && ɵ$index_5_r4 !== ctx_r4.activeIndex)("ariaCurrentWhenActive", ctx_r4.exact ? "step" : void 0);
    ɵɵadvance();
    ɵɵclassMap(ctx_r4.cx("itemNumber"));
    ɵɵadvance();
    ɵɵtextInterpolate(ɵ$index_5_r4 + 1);
    ɵɵadvance();
    ɵɵproperty("ngIf", item_r3.escape !== false)("ngIfElse", htmlLabel_r6);
  }
}
function Steps_For_4_li_0_ng_template_3_span_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span");
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext(3).$implicit;
    const ctx_r4 = ɵɵnextContext();
    ɵɵclassMap(ctx_r4.cx("itemLabel"));
    ɵɵadvance();
    ɵɵtextInterpolate(item_r3.label);
  }
}
function Steps_For_4_li_0_ng_template_3_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 12);
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext(3).$implicit;
    const ctx_r4 = ɵɵnextContext();
    ɵɵclassMap(ctx_r4.cx("itemLabel"));
    ɵɵproperty("innerHTML", item_r3.label, ɵɵsanitizeHtml);
  }
}
function Steps_For_4_li_0_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "a", 13);
    ɵɵlistener("click", function Steps_For_4_li_0_ng_template_3_Template_a_click_0_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext(2);
      const item_r3 = ctx_r1.$implicit;
      const ɵ$index_5_r4 = ctx_r1.$index;
      const ctx_r4 = ɵɵnextContext();
      return ɵɵresetView(ctx_r4.onItemClick($event, item_r3, ɵ$index_5_r4));
    })("keydown", function Steps_For_4_li_0_ng_template_3_Template_a_keydown_0_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext(2);
      const item_r3 = ctx_r1.$implicit;
      const ɵ$index_5_r4 = ctx_r1.$index;
      const ctx_r4 = ɵɵnextContext();
      return ɵɵresetView(ctx_r4.onItemKeydown($event, item_r3, ɵ$index_5_r4));
    });
    ɵɵelementStart(1, "span");
    ɵɵtext(2);
    ɵɵelementEnd();
    ɵɵtemplate(3, Steps_For_4_li_0_ng_template_3_span_3_Template, 2, 3, "span", 11)(4, Steps_For_4_li_0_ng_template_3_ng_template_4_Template, 1, 3, "ng-template", null, 4, ɵɵtemplateRefExtractor);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const htmlRouteLabel_r8 = ɵɵreference(5);
    const ctx_r1 = ɵɵnextContext(2);
    const item_r3 = ctx_r1.$implicit;
    const ɵ$index_5_r4 = ctx_r1.$index;
    const ctx_r4 = ɵɵnextContext();
    ɵɵclassMap(ctx_r4.cx("itemLink"));
    ɵɵproperty("target", item_r3.target);
    ɵɵattribute("href", item_r3.url, ɵɵsanitizeUrl)("tabindex", ctx_r4.getItemTabIndex(item_r3, ɵ$index_5_r4))("aria-expanded", ɵ$index_5_r4 === ctx_r4.activeIndex)("aria-disabled", item_r3.disabled || ctx_r4.readonly && ɵ$index_5_r4 !== ctx_r4.activeIndex)("ariaCurrentWhenActive", ctx_r4.exact && (!item_r3.disabled || ctx_r4.readonly) ? "step" : void 0);
    ɵɵadvance();
    ɵɵclassMap(ctx_r4.cx("itemNumber"));
    ɵɵadvance();
    ɵɵtextInterpolate(ɵ$index_5_r4 + 1);
    ɵɵadvance();
    ɵɵproperty("ngIf", item_r3.escape !== false)("ngIfElse", htmlRouteLabel_r8);
  }
}
function Steps_For_4_li_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "li", 8, 1);
    ɵɵtemplate(2, Steps_For_4_li_0_a_2_Template, 6, 22, "a", 9)(3, Steps_For_4_li_0_ng_template_3_Template, 6, 13, "ng-template", null, 2, ɵɵtemplateRefExtractor);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const elseBlock_r9 = ɵɵreference(4);
    const ctx_r1 = ɵɵnextContext();
    const item_r3 = ctx_r1.$implicit;
    const ɵ$index_5_r4 = ctx_r1.$index;
    const ctx_r4 = ɵɵnextContext();
    ɵɵclassMap(ctx_r4.cx("item", ɵɵpureFunction2(9, _c1, item_r3, ɵ$index_5_r4)));
    ɵɵproperty("ngStyle", item_r3.style)("tooltipOptions", item_r3.tooltipOptions);
    ɵɵattribute("aria-current", ctx_r4.isActive(item_r3, ɵ$index_5_r4) ? "step" : void 0)("id", item_r3.id)("data-pc-section", "menuitem");
    ɵɵadvance(2);
    ɵɵproperty("ngIf", ctx_r4.isClickableRouterLink(item_r3))("ngIfElse", elseBlock_r9);
  }
}
function Steps_For_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Steps_For_4_li_0_Template, 5, 12, "li", 7);
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    ɵɵproperty("ngIf", item_r3.visible !== false);
  }
}
var classes = {
  root: ({
    instance
  }) => ["p-steps p-component", {
    "p-readonly": instance.readonly
  }],
  list: "p-steps-list",
  item: ({
    instance,
    item,
    index
  }) => ["p-steps-item", {
    "p-steps-item-active": instance.isActive(item, index),
    "p-disabled": instance.isItemDisabled(item, index)
  }],
  itemLink: "p-steps-item-link",
  itemNumber: "p-steps-item-number",
  itemLabel: "p-steps-item-label"
};
var StepsStyle = class _StepsStyle extends BaseStyle {
  name = "steps";
  theme = style;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵStepsStyle_BaseFactory;
    return function StepsStyle_Factory(__ngFactoryType__) {
      return (ɵStepsStyle_BaseFactory || (ɵStepsStyle_BaseFactory = ɵɵgetInheritedFactory(_StepsStyle)))(__ngFactoryType__ || _StepsStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _StepsStyle,
    factory: _StepsStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StepsStyle, [{
    type: Injectable
  }], null, null);
})();
var StepsClasses;
(function(StepsClasses2) {
  StepsClasses2["root"] = "p-steps";
  StepsClasses2["list"] = "p-steps-list";
  StepsClasses2["item"] = "p-steps-item";
  StepsClasses2["itemLink"] = "p-steps-item-link";
  StepsClasses2["itemNumber"] = "p-steps-item-number";
  StepsClasses2["itemLabel"] = "p-steps-item-label";
})(StepsClasses || (StepsClasses = {}));
var Steps = class _Steps extends BaseComponent {
  /**
   * Index of the active item.
   * @group Props
   */
  activeIndex = 0;
  /**
   * An array of menu items.
   * @group Props
   */
  model;
  /**
   * Whether the items are clickable or not.
   * @group Props
   */
  readonly = true;
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  /**
   * Style class of the component.
   * @group Props
   */
  styleClass;
  /**
   * Whether to apply 'router-link-active-exact' class if route exactly matches the item path.
   * @group Props
   */
  exact = true;
  /**
   * Callback to invoke when the new step is selected.
   * @param {number} number - current index.
   * @group Emits
   */
  activeIndexChange = new EventEmitter();
  listViewChild;
  router = inject(Router);
  route = inject(ActivatedRoute);
  _componentStyle = inject(StepsStyle);
  subscription;
  ngOnInit() {
    super.ngOnInit();
    this.subscription = this.router.events.subscribe(() => this.cd.markForCheck());
  }
  onItemClick(event, item, i) {
    if (this.readonly || item.disabled) {
      event.preventDefault();
      return;
    }
    this.activeIndexChange.emit(i);
    if (!item.url && !item.routerLink) {
      event.preventDefault();
    }
    if (item.command) {
      item.command({
        originalEvent: event,
        item,
        index: i
      });
    }
  }
  onItemKeydown(event, item, i) {
    switch (event.code) {
      case "ArrowRight": {
        this.navigateToNextItem(event.target);
        event.preventDefault();
        break;
      }
      case "ArrowLeft": {
        this.navigateToPrevItem(event.target);
        event.preventDefault();
        break;
      }
      case "Home": {
        this.navigateToFirstItem(event.target);
        event.preventDefault();
        break;
      }
      case "End": {
        this.navigateToLastItem(event.target);
        event.preventDefault();
        break;
      }
      case "Tab":
        if (i !== (this.activeIndex ?? -1)) {
          const siblings = Y(this.listViewChild?.nativeElement, '[data-pc-section="menuitem"]');
          siblings[i].children[0].tabIndex = "-1";
          siblings[this.activeIndex ?? 0].children[0].tabIndex = "0";
        }
        break;
      case "Enter":
      case "Space": {
        this.onItemClick(event, item, i);
        event.preventDefault();
        break;
      }
      default:
        break;
    }
  }
  navigateToNextItem(target) {
    const nextItem = this.findNextItem(target);
    nextItem && this.setFocusToMenuitem(target, nextItem);
  }
  navigateToPrevItem(target) {
    const prevItem = this.findPrevItem(target);
    prevItem && this.setFocusToMenuitem(target, prevItem);
  }
  navigateToFirstItem(target) {
    const firstItem = this.findFirstItem();
    firstItem && this.setFocusToMenuitem(target, firstItem);
  }
  navigateToLastItem(target) {
    const lastItem = this.findLastItem();
    lastItem && this.setFocusToMenuitem(target, lastItem);
  }
  findNextItem(item) {
    const nextItem = item.parentElement.nextElementSibling;
    return nextItem ? nextItem.children[0] : null;
  }
  findPrevItem(item) {
    const prevItem = item.parentElement.previousElementSibling;
    return prevItem ? prevItem.children[0] : null;
  }
  findFirstItem() {
    const firstSibling = z(this.listViewChild?.nativeElement, '[data-pc-section="menuitem"]');
    return firstSibling ? firstSibling.children[0] : null;
  }
  findLastItem() {
    const siblings = Y(this.listViewChild?.nativeElement, '[data-pc-section="menuitem"]');
    return siblings ? siblings[siblings.length - 1].children[0] : null;
  }
  setFocusToMenuitem(target, focusableItem) {
    target.tabIndex = "-1";
    focusableItem.tabIndex = "0";
    focusableItem.focus();
  }
  isClickableRouterLink(item) {
    return item.routerLink && !this.readonly && !item.disabled;
  }
  isItemDisabled(item, index) {
    return item.disabled || this.readonly && !this.isActive(item, index);
  }
  isActive(item, index) {
    if (item.routerLink) {
      let routerLink = Array.isArray(item.routerLink) ? item.routerLink : [item.routerLink];
      return this.router.isActive(this.router.createUrlTree(routerLink, {
        relativeTo: this.route
      }).toString(), false);
    }
    return index === this.activeIndex;
  }
  getItemTabIndex(item, index) {
    if (item.disabled) {
      return "-1";
    }
    if (!item.disabled && this.activeIndex === index) {
      return item.tabindex || "0";
    }
    return item.tabindex ?? "-1";
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    super.ngOnDestroy();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSteps_BaseFactory;
    return function Steps_Factory(__ngFactoryType__) {
      return (ɵSteps_BaseFactory || (ɵSteps_BaseFactory = ɵɵgetInheritedFactory(_Steps)))(__ngFactoryType__ || _Steps);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _Steps,
    selectors: [["p-steps"]],
    viewQuery: function Steps_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.listViewChild = _t.first);
      }
    },
    inputs: {
      activeIndex: [2, "activeIndex", "activeIndex", numberAttribute],
      model: "model",
      readonly: [2, "readonly", "readonly", booleanAttribute],
      style: "style",
      styleClass: "styleClass",
      exact: [2, "exact", "exact", booleanAttribute]
    },
    outputs: {
      activeIndexChange: "activeIndexChange"
    },
    features: [ɵɵProvidersFeature([StepsStyle]), ɵɵInheritDefinitionFeature],
    decls: 5,
    vars: 7,
    consts: [["list", ""], ["menuitem", ""], ["elseBlock", ""], ["htmlLabel", ""], ["htmlRouteLabel", ""], [3, "ngStyle"], ["pTooltip", "", 3, "class", "ngStyle", "tooltipOptions"], ["pTooltip", "", 3, "class", "ngStyle", "tooltipOptions", 4, "ngIf"], ["pTooltip", "", 3, "ngStyle", "tooltipOptions"], ["role", "link", 3, "routerLink", "queryParams", "routerLinkActiveOptions", "class", "target", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "click", "keydown", 4, "ngIf", "ngIfElse"], ["role", "link", 3, "click", "keydown", "routerLink", "queryParams", "routerLinkActiveOptions", "target", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state"], [3, "class", 4, "ngIf", "ngIfElse"], [3, "innerHTML"], ["role", "link", 3, "click", "keydown", "target"]],
    template: function Steps_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "nav", 5)(1, "ul", null, 0);
        ɵɵrepeaterCreate(3, Steps_For_4_Template, 1, 1, "li", 6, _forTrack0);
        ɵɵelementEnd()();
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.cn(ctx.cx("root"), ctx.styleClass));
        ɵɵproperty("ngStyle", ctx.style);
        ɵɵattribute("data-pc-name", "steps");
        ɵɵadvance();
        ɵɵclassMap(ctx.cx("list"));
        ɵɵattribute("data-pc-section", "menu");
        ɵɵadvance(2);
        ɵɵrepeater(ctx.model);
      }
    },
    dependencies: [CommonModule, NgIf, NgStyle, RouterModule, RouterLink, TooltipModule, Tooltip, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Steps, [{
    type: Component,
    args: [{
      selector: "p-steps",
      standalone: true,
      imports: [CommonModule, RouterModule, TooltipModule, SharedModule],
      template: `
        <nav [class]="cn(cx('root'), styleClass)" [ngStyle]="style" [attr.data-pc-name]="'steps'">
            <ul #list [attr.data-pc-section]="'menu'" [class]="cx('list')">
                @for (item of model; track item.label; let i = $index) {
                    <li
                        *ngIf="item.visible !== false"
                        [class]="cx('item', { item, index: i })"
                        #menuitem
                        [ngStyle]="item.style"
                        [attr.aria-current]="isActive(item, i) ? 'step' : undefined"
                        [attr.id]="item.id"
                        pTooltip
                        [tooltipOptions]="item.tooltipOptions"
                        [attr.data-pc-section]="'menuitem'"
                    >
                        <a
                            role="link"
                            *ngIf="isClickableRouterLink(item); else elseBlock"
                            [routerLink]="item.routerLink"
                            [queryParams]="item.queryParams"
                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                            [class]="cx('itemLink')"
                            (click)="onItemClick($event, item, i)"
                            (keydown)="onItemKeydown($event, item, i)"
                            [target]="item.target"
                            [attr.tabindex]="getItemTabIndex(item, i)"
                            [attr.aria-expanded]="i === activeIndex"
                            [attr.aria-disabled]="item.disabled || (readonly && i !== activeIndex)"
                            [fragment]="item.fragment"
                            [queryParamsHandling]="item.queryParamsHandling"
                            [preserveFragment]="item.preserveFragment"
                            [skipLocationChange]="item.skipLocationChange"
                            [replaceUrl]="item.replaceUrl"
                            [state]="item.state"
                            [attr.ariaCurrentWhenActive]="exact ? 'step' : undefined"
                        >
                            <span [class]="cx('itemNumber')">{{ i + 1 }}</span>
                            <span [class]="cx('itemLabel')" *ngIf="item.escape !== false; else htmlLabel">{{ item.label }}</span>
                            <ng-template #htmlLabel><span [class]="cx('itemLabel')" [innerHTML]="item.label"></span></ng-template>
                        </a>
                        <ng-template #elseBlock>
                            <a
                                role="link"
                                [attr.href]="item.url"
                                [class]="cx('itemLink')"
                                (click)="onItemClick($event, item, i)"
                                (keydown)="onItemKeydown($event, item, i)"
                                [target]="item.target"
                                [attr.tabindex]="getItemTabIndex(item, i)"
                                [attr.aria-expanded]="i === activeIndex"
                                [attr.aria-disabled]="item.disabled || (readonly && i !== activeIndex)"
                                [attr.ariaCurrentWhenActive]="exact && (!item.disabled || readonly) ? 'step' : undefined"
                            >
                                <span [class]="cx('itemNumber')">{{ i + 1 }}</span>
                                <span [class]="cx('itemLabel')" *ngIf="item.escape !== false; else htmlRouteLabel">{{ item.label }}</span>
                                <ng-template #htmlRouteLabel><span [class]="cx('itemLabel')" [innerHTML]="item.label"></span></ng-template>
                            </a>
                        </ng-template>
                    </li>
                }
            </ul>
        </nav>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [StepsStyle]
    }]
  }], null, {
    activeIndex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    model: [{
      type: Input
    }],
    readonly: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    exact: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    activeIndexChange: [{
      type: Output
    }],
    listViewChild: [{
      type: ViewChild,
      args: ["list", {
        static: false
      }]
    }]
  });
})();
var StepsModule = class _StepsModule {
  static ɵfac = function StepsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StepsModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _StepsModule,
    imports: [Steps, SharedModule],
    exports: [Steps, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Steps, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StepsModule, [{
    type: NgModule,
    args: [{
      imports: [Steps, SharedModule],
      exports: [Steps, SharedModule]
    }]
  }], null, null);
})();
export {
  Steps,
  StepsClasses,
  StepsModule,
  StepsStyle
};
//# sourceMappingURL=primeng_steps.js.map
