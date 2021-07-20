import { NgModule } from '@angular/core';
import { ImagesLazyloadDirective } from './images-lazyload.directive';

@NgModule({
  declarations: [ImagesLazyloadDirective],

  // chúng ta chỉ cần export directive để sử dụng, không cần export service ra ngoài
  exports: [ImagesLazyloadDirective],
})
export class ImagesLazyloadModule { }