import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';
import { SingerListComponent } from './singer-list/singer-list.component';
import { UploadTestComponent } from './upload-test/upload-test.component';

registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent, VirtualScrollComponent, SingerListComponent, UploadTestComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent],
})
export class AppModule {}
