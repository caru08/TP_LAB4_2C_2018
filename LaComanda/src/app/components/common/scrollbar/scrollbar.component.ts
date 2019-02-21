/**
 https://github.com/baktash93/ng2Scrollster
 **/
import { Component, ViewChild, OnInit, ElementRef, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: '[ng-scrollster]',
  templateUrl:"./scrollbar.component.html",
  styleUrls: ["./scrollbar.component.scss"]
})

export class ContainerScrollBar implements OnInit {
  @ViewChild('contentWrapper', { read: ElementRef }) contentWrapperRef:any;
  @ViewChild('scrollableContent', { read: ElementRef }) scrollableContentRef: any;
  @ViewChild('scrollBarV', { read: ElementRef }) scrollBarVRef: any;
  @ViewChild('scrollBarH', { read: ElementRef }) scrollBarHRef: any;

  @Input() barOptions: any;
  @Output() scrollEvent: EventEmitter<any>;

  private host: any;
  private SCROLL_DISTANCE: any;
  private scrollableContent: any;
  private contentWrapper: any;
  private scrollBarV: any;
  private scrollBarH: any;
  private sizeChangeEvent: Event;
  private wheelHandler: any;
  private handlers:any= {
    wheelHandler:null,
    scrollbarV:{
      isBarDragging:false,
      startPosY:0,
      barOffsetTop:0,
      mousedown:null,
      mousemove:null,
      mouseup:null
    },
    scrollbarH:{
      isBarDragging:false,
      startPosX:0,
      barOffsetLeft:0,
      mousedown:null,
      mousemove:null,
      mouseup:null
    }
  }

  constructor(private elemRef: ElementRef) {
    this.host = elemRef.nativeElement;
    this.sizeChangeEvent = new Event('sizeChange');
    this.scrollEvent = new EventEmitter();
  }

  ngOnInit(): void {
    this.initWheelHandler();
    this.init();
  }

  private scrollContent(target: any, delta: any, distance: any, isTargetRelativeToBoundary: boolean): void {
    let top = parseFloat(getComputedStyle(target).top);
    let scrollableDistance = top + (delta * distance);


    if (isTargetRelativeToBoundary) {
      let scrollLimit = this.contentWrapper.clientHeight - this.scrollBarV.offsetHeight;

      if (scrollableDistance <= 0) {
        this.setTop(target, 0);
        return;
      } else if ((target.offsetHeight + scrollableDistance) >= this.contentWrapper.clientHeight) {
        this.setTop(target, scrollLimit);
        return;
      }
      this.setTop(target, scrollableDistance);
    } else {
      if (scrollableDistance >= 0) {
        this.setTop(target, 0);
        return;
      } else if ((parseInt(target.offsetHeight) - Math.abs(scrollableDistance)) <= parseInt(this.contentWrapper.clientHeight)) {
        this.setTop(target, -1 * (parseInt(target.offsetHeight) - parseInt(this.contentWrapper.offsetHeight)));
        return;
      }
      this.setTop(target, scrollableDistance);
    }
  }

  private dragContentV(target: any, distance: any, isTargetRelativeToBoundary: any): void {
    if (isTargetRelativeToBoundary) {
      let scrollLimit = this.contentWrapper.clientHeight - this.scrollBarV.offsetHeight;
      if (distance <= 0) {
        this.setTop(target, 0);
        return;
      }
      else if ((target.offsetHeight + distance) >= this.contentWrapper.clientHeight) {
        this.setTop(target, scrollLimit);
        return;
      }
      this.setTop(target, distance);
    } else {
      if (distance >= 0) {
        this.setTop(target, 0);
        return;
      } else if ((parseInt(target.offsetHeight) - Math.abs(distance)) <= parseInt(this.contentWrapper.clientHeight)) {
        this.setTop(target, -1 * (parseInt(target.offsetHeight) - parseInt(this.contentWrapper.offsetHeight)));
        return;
      }
      this.setTop(target, distance);
    }
  }

  private dragContentH(target: any, distance: any, isTargetRelativeToBoundary: any): void {
    if (isTargetRelativeToBoundary) {
      let dragLimit = this.contentWrapper.clientWidth - this.scrollBarH.offsetWidth;
      if (distance <= 0) {
        this.setLeft(target, 0);
        return;
      }
      else if ((target.offsetWidth + distance) >= this.contentWrapper.clientWidth) {
        this.setLeft(target, dragLimit);
        return;
      }
      this.setLeft(target, distance);
    } else {
      if (distance >= 0) {
        this.setLeft(target, 0);
        return;
      } else if ((parseInt(target.offsetWidth) - Math.abs(distance)) <= parseInt(this.contentWrapper.clientWidth)) {
        this.setLeft(target, -1 * (parseInt(target.offsetWidth) - parseInt(this.contentWrapper.offsetWidth)));
        return;
      }
      this.setLeft(target, distance);
    }
  }

  private getWheelDelta(evt: any): number {
    return evt.deltaY > 0 ? -1 : 1
  }

  private initWheelScroll(): void {
    this.contentWrapper.addEventListener('wheel', this.getWheelHandler());
  }

  private resetWheelScroll(): void {
    this.contentWrapper.removeEventListener('wheel', this.getWheelHandler());
  }

  private setContainerHeight(): void {
    // this.contentWrapper.style.height = !(this.contentWrapper.parentNode.clientHeight < 150) ?
    //   this.contentWrapper.parentNode.clientHeight : 300;
  }

  private setTop(el: any, top: any): void {
    let percentage: number = -parseInt(this.scrollableContent.style.top) / (this.scrollableContent.clientHeight - this.contentWrapper.clientHeight);
    el.style.top = top+'px';
    this.scrollEvent.emit(percentage);
  }

  private setLeft(el: any, left: any): void {
    el.style.left = left;
    this.scrollEvent.emit(null);
  }

  initVerticalScroll(): void {
    let isScrollable;

    // setTimeout(() => {
      let barLength = parseInt(this.contentWrapper.clientHeight) / parseInt(this.scrollableContent.clientHeight) * parseInt(this.contentWrapper.clientHeight);
      isScrollable = barLength < this.contentWrapper.clientHeight;
      if (!isScrollable) {
        this.resetWheelScroll();
        this.scrollBarV.style.height = '0px';
        this.scrollBarV.style.top = '0px';
        this.scrollableContent.style.top = '0px';
        return;
      }
      this.scrollBarV.style.height = barLength+'px';

      this.initBarCSS();
      this.initVBarDrag();
      this.initWheelScroll();
    // }, 1);
  }

  initHorizontalScroll(): void {
    let isScrollable;

    // setTimeout(() => {
      this.scrollableContent.style.width = 'unset';

      let barLength = parseInt(this.contentWrapper.offsetWidth) /
        parseInt(this.scrollableContent.offsetWidth) * parseInt(this.contentWrapper.offsetWidth);

      isScrollable = barLength < this.contentWrapper.clientWidth ? true : false;

      if (!isScrollable) {
        this.scrollableContent.style.width = '100%';
        this.scrollableContent.style.left = '0px';
        this.scrollBarH.style.width = 'unset';
        return;
      }

      this.scrollBarH.style.width = barLength;
      this.initHBarDrag();
      this.initBarCSS();
    // }, 1);
  }

  private initHBarDrag(): void {
    if (this.handlers.scrollbarH.mousedown) {
      return;
    }
    this.handlers.scrollbarH.mousedown = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      this.handlers.scrollbarH.isBarDragging = true;

      this.handlers.scrollbarH.startPosX = e.pageX - this.contentWrapper.offsetLeft;
      this.handlers.scrollbarH.barOffsetLeft = this.scrollBarH.offsetLeft;
    }


    this.handlers.scrollbarH.mousemove=(e:any) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.handlers.scrollbarH.isBarDragging) return;

      let currentPosX = e.pageX - this.contentWrapper.offsetLeft,
        mouseMoveDistance = currentPosX - this.handlers.scrollbarH.startPosX,
        barMoveDistance = mouseMoveDistance + this.handlers.scrollbarH.barOffsetLeft;

      this.dragContentH(this.scrollBarH, barMoveDistance, true);
      this.dragContentH(this.scrollableContent, -(barMoveDistance * (this.scrollableContent.clientWidth / this.contentWrapper.clientWidth)), false);
    }

    this.handlers.scrollbarH.mouseup=(e:any) => {
      if (!this.handlers.scrollbarH.isBarDragging) return;
      this.handlers.scrollbarH.isBarDragging = false;
    }

    this.scrollBarH.addEventListener('mousedown', this.handlers.scrollbarH.mousedown);
    window.addEventListener('mousemove', this.handlers.scrollbarH.mousemove)
    window.addEventListener('mouseup', this.handlers.scrollbarH.mouseup)
  }

  private initVBarDrag(): void {

    if(this.handlers.scrollbarV.mousedown){
      return;
    }
    this.handlers.scrollbarV.mousedown = (e:any) => {
      e.preventDefault();
      e.stopPropagation();
      this.handlers.scrollbarV.isBarDragging = true;

      this.handlers.scrollbarV.startPosY = e.pageY - this.contentWrapper.offsetTop;
      this.handlers.scrollbarV.barOffsetTop = this.scrollBarV.offsetTop;
    }
    this.handlers.scrollbarV.mousemove = (e:any) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.handlers.scrollbarV.isBarDragging) return;

      let currentPosY = e.pageY - this.contentWrapper.offsetTop;
      let mouseMoveDistance = currentPosY - this.handlers.scrollbarV.startPosY;
      let barMoveDistance = mouseMoveDistance + this.handlers.scrollbarV.barOffsetTop;

      this.dragContentV(this.scrollBarV, barMoveDistance, true);
      this.dragContentV(this.scrollableContent, -(barMoveDistance * (this.scrollableContent.clientHeight / this.contentWrapper.clientHeight)), false);
    }
    this.handlers.scrollbarV.mouseup = (e:any) => {
      if (!this.handlers.scrollbarV.isBarDragging) return;
      this.handlers.scrollbarV.isBarDragging = false;
    }

    this.scrollBarV.addEventListener('mousedown', this.handlers.scrollbarV.mousedown);
    window.addEventListener('mousemove', this.handlers.scrollbarV.mousemove);
    window.addEventListener('mouseup', this.handlers.scrollbarV.mouseup);
  }

  private watchScrollableContent(): void {
    let initialHeight = this.scrollableContent.offsetHeight,
      initialWidth = this.scrollableContent.offsetWidth;
    this.contentWrapper.addEventListener('sizeChange', (e:any) => {

      this.setContainerHeight();
      this.initVerticalScroll();
      this.initHorizontalScroll();
    });

    setInterval(() => {
      let sizeChangeEvent = this.sizeChangeEvent,
        currentHeight = this.scrollableContent.getBoundingClientRect().height,
        currentWidth = this.scrollableContent.getBoundingClientRect().width;

      if (initialHeight !== currentHeight || initialWidth !== currentWidth) {
        initialHeight = currentHeight;
        initialWidth = currentWidth;
        this.contentWrapper.dispatchEvent(sizeChangeEvent);
      }
    }, 500);
  }

  private watchHostSize(): void {
    let initialHostHeight = this.host.clientHeight,
      initialHostWidth = this.host.clientWidth,
      currentHostHeight,
      currentHostWidth;

    setInterval(() => {
      currentHostHeight = this.host.clientHeight;
      currentHostWidth = this.host.clientWidth;
      if (initialHostHeight !== currentHostHeight || initialHostWidth !== currentHostWidth) {
        initialHostHeight = currentHostHeight;
        initialHostWidth = currentHostWidth;
        this.contentWrapper.dispatchEvent(this.sizeChangeEvent);
      }
    }, 500);
  }

  private initBarCSS(): void {
    let options = this.barOptions;
    if (typeof options !== 'object') return;

    for (let property in options) {
      this.scrollBarV.style[property] = options[property];
      this.scrollBarH.style[property] = options[property];
    }
  }

  private initWheelHandler() {
    let self = this;
    this.handlers.wheelHandler = (e: any) => {
      e.preventDefault();
      let delta = self.getWheelDelta(e);
      let distance = self.SCROLL_DISTANCE;
      self.scrollContent(self.scrollableContent, delta, distance, false);
      self.scrollContent(self.scrollBarV, delta, -(distance * (self.contentWrapper.clientHeight / self.scrollableContent.clientHeight)), true);
    }
  }

  private getWheelHandler(): any {
    return this.handlers.wheelHandler;
  }

  init(): void {
    this.SCROLL_DISTANCE = 100;
    this.scrollableContent = this.scrollableContentRef.nativeElement;
    this.contentWrapper = this.contentWrapperRef.nativeElement;
    this.scrollBarV = this.scrollBarVRef.nativeElement;
    this.scrollBarH = this.scrollBarHRef.nativeElement;
    this.initVerticalScroll();
    this.initHorizontalScroll();
    this.watchScrollableContent();
    this.watchHostSize();
    this.setContainerHeight();
  }
}
