import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesLazyloadService {
  private observer: IntersectionObserver;

  constructor() {
    this.init();
  }

  private init() {
    // Khởi tạo
    this.observer = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach(entry => {
        // chưa đến viewport, dừng sớm bớt đau khổ
        if (!entry.isIntersecting) {
          return;
        }

        // src được lưu trong data-src, chúng ta copy nó vào src là xong.
        const lazyImage = entry.target as HTMLImageElement;
        const src = lazyImage.dataset.src;

        // nếu ảnh là thẻ img, copy vào src
        // nếu ảnh là background image, copy vào background-image
        lazyImage.tagName.toLowerCase() === 'img'
          ? lazyImage.src = src
          : lazyImage.style.backgroundImage = 'url(\'' + src + '\')';

        // xong việc thì nên dọn dẹp
        lazyImage.removeAttribute('lazy');

        // tiếp tục dọn dẹp
        imgObserver.unobserve(lazyImage);
      });
    });
  }

  observe(target: Element) {
    // "trải chiếu nằm chờ" tấm ảnh scroll tới viewport
    this.observer.observe(target);
  }
}