import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodePreviewComponent } from './code-preview.component';

import { HighlightModule } from 'ngx-highlightjs';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [CodePreviewComponent],
  imports: [
    CommonModule,
    HighlightModule, // https://www.npmjs.com/package/ngx-highlightjs
    ClipboardModule, // https://www.npmjs.com/package/ngx-clipboard,
    NgbTabsetModule
  ],
  exports: [CodePreviewComponent],
})
export class CodePreviewModule { }
