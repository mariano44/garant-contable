import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TokenStorageService } from '../../../core/JWT/token-storage.service';

import MetisMenu from 'metismenujs/dist/metismenujs';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  @ViewChild('sidebarToggler') sidebarToggler: ElementRef;
  user: any;
  menuItems = [];
  @ViewChild('sidebarMenu') sidebarMenu: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document, private storage: TokenStorageService,private renderer: Renderer2, router: Router) {
    router.events.forEach((event) => {
      this.user = this.storage.getUser();
      if (event instanceof NavigationEnd) {

        /**
         * Activating the current active item dropdown
         */
        // this._activateMenuDropdown();

        /**
         * closing the sidebar
         */
        if (window.matchMedia('(max-width: 991px)').matches) {
          this.document.body.classList.remove('sidebar-open');
        }

      }
    });
  }

  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.menuItems = [{
      label: 'Navegación',
      isTitle: true,
      disabled: ''
    },];
    if(this.user['tipo'] != 'cliente'){
      for(let y=0;y<this.user['permisos'].length;y++){
        if(this.user['permisos'][y]['vista'] == 'Dashboard'){
          this.menuItems.push({
            label: 'Dashboard',
            icon: 'home',
            link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '/dashboard' : null),
            disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
            active: ''
          });
        }
        if(this.user['permisos'][y]['vista'] == 'Reportes'){
          this.menuItems.push({
            label: 'Reportes',
            icon: 'bar-chart',
            link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '/general/reportes' : null),
            disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
            active: ''
          });
        }
        if(this.user['permisos'][y]['vista'] == 'Documentos'){
          this.menuItems.push({
            label: 'Documentos',
            icon: 'folder',
            link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '/general/documentos' : null),
            disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
            active: ''
          });
        }
        if(this.user['permisos'][y]['vista'] == 'Facturación'){
          this.menuItems.push({
            label: 'Facturación',
            icon: 'file-text',
            link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '/general/facturacion' : null),
            disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
            active: ''
          });

        }
        if(this.user['permisos'][y]['vista'] == 'Nómina'){
          this.menuItems.push({
            label: 'Nómina',
            icon: 'users',
            link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '/general/nomina' : null),
            disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
            active: ''
          });
        }
      }
      this.menuItems.push({
        label: 'Solo Contadores',
        isTitle: true,
        disabled: ''
      });
      for(let y=0;y<this.user['permisos'].length;y++){
        if(this.user['permisos'][y]['vista'] == 'Subir CFDIs'){
          this.menuItems.push({
            label: 'Subir CFDIs',
            icon: 'file-text',
            link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '/general/upcfdis' : null),
            disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
            active: ''
          });
        }
        if(this.user['permisos'][y]['vista'] == 'Clasificar Rubros'){
          this.menuItems.push({
            label: 'Clasificar Rubros',
            icon: 'check-square',
            link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '/general/clasificar' : null),
            disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
            active: ''
          });
        }
      }
      this.menuItems.push({
        label: 'Configuraciones',
        isTitle: true,
        disabled: ''
      });
      for(let y=0;y<this.user['permisos'].length;y++){
        if(this.user['permisos'][y]['vista'] == 'Usuarios'){
          this.menuItems.push({
            label: 'Usuarios',
            icon: 'users',
            link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '/general/users' : null),
            disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
            active: ''
          });
        }
        if(this.user['rolid'] <= 15){
          if(this.user['permisos'][y]['vista'] == 'Roles'){
            this.menuItems.push({
              label: 'Roles',
              icon: 'sliders',
              link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ?  '/general/roles' : null),
              disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
              active: ''
            });
          }
          if(this.user['permisos'][y]['vista'] == 'Planes'){
            this.menuItems.push({
              label: 'Planes',
              icon: 'dollar-sign',
              link: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '/general/planes' : null),
              disabled: (this.user['permisos'][y]['lista'] == 1 || this.user['permisos'][y]['creacion'] == 1 || this.user['permisos'][y]['edicion'] == 1 || this.user['permisos'][y]['eliminar'] == 1 ? '' :'text-muted'),
              active: ''
            });
          }
        }
      }
    }else{
      for(let y=0;y<this.user['permisos'].length;y++){
        if(this.user['permisos'][y]['vista'] == 'Dashboard'){
          this.menuItems.push({
            label: 'Dashboard',
            icon: 'home',
            link: (this.user['permisos'][y]['activa'] == 1 ? '/dashboard' : null),
            disabled: (this.user['permisos'][y]['activa'] == 1  ? '' :'text-muted'),
            active: ''
          });
        }
        if(this.user['permisos'][y]['vista'] == 'Reportes'){
          this.menuItems.push({
            label: 'Reportes',
            icon: 'bar-chart',
            link: (this.user['permisos'][y]['activa'] == 1 ? '/general/reportes' : null),
            disabled: (this.user['permisos'][y]['activa'] == 1  ? '' :'text-muted'),
            active: ''
          });
        }
        if(this.user['permisos'][y]['vista'] == 'Documentos'){
          this.menuItems.push({
            label: 'Documentos',
            icon: 'folder',
            link: (this.user['permisos'][y]['activa'] == 1 ? '/general/documentos' : null),
            disabled: (this.user['permisos'][y]['activa'] == 1 ? '' : 'text-muted'),
            active: ''
          });
        }
        if(this.user['permisos'][y]['vista'] == 'Facturación'){
          this.menuItems.push({
            label: 'Facturación',
            icon: 'file-text',
            link: (this.user['permisos'][y]['activa'] == 1 ? '/general/facturacion' : null),
            disabled: (this.user['permisos'][y]['activa'] == 1  ? '' : 'text-muted'),
            active: ''
          });
        }
        if(this.user['permisos'][y]['vista'] == 'Nómina'){
          this.menuItems.push({
            label: 'Nómina',
            icon: 'users',
            link: (this.user['permisos'][y]['activa'] == 1 ? '/general/nomina' : null),
            disabled: (this.user['permisos'][y]['activa'] == 1  ? '' :'text-muted'),
            active: ''
          });
        }
      }
    }
    /**
     * Sidebar-folded on desktop (min-width:992px and max-width: 1199px)
     */
    const desktopMedium = window.matchMedia('(min-width:992px) and (max-width: 1199px)');
    desktopMedium.addListener(this.iconSidebar);
    this.iconSidebar(desktopMedium);


  }

  ngAfterViewInit() {
    // activate menu item
    new MetisMenu(this.sidebarMenu.nativeElement);
    this._activateMenuDropdown();
  }

  /**
   * Toggle sidebar on hamburger button click
   */
  toggleSidebar(e) {
    this.sidebarToggler.nativeElement.classList.toggle('not-active');
    this.sidebarToggler.nativeElement.classList.toggle('active');
    if (window.matchMedia('(min-width: 992px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-folded');
    } else if (window.matchMedia('(max-width: 991px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-open');
    }
  }


  /**
   * Toggle settings-sidebar
   */
  toggleSettingsSidebar(e) {
    e.preventDefault();
    this.document.body.classList.toggle('settings-open');
  }


  /**
   * Open sidebar when hover (in folded folded state)
   */
  operSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')){
      this.document.body.classList.add("open-sidebar-folded");
    }
  }


  /**
   * Fold sidebar after mouse leave (in folded state)
   */
  closeSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')){
      this.document.body.classList.remove("open-sidebar-folded");
    }
  }

  /**
   * Sidebar-folded on desktop (min-width:992px and max-width: 1199px)
   */
  iconSidebar(e) {
    if (e.matches) {
      this.document.body.classList.add('sidebar-folded');
    } else {
      this.document.body.classList.remove('sidebar-folded');
    }
  }


  /**
   * Switching sidebar light/dark
   */
  onSidebarThemeChange(event) {
    this.document.body.classList.remove('sidebar-light', 'sidebar-dark');
    this.document.body.classList.add(event.target.value);
    this.document.body.classList.remove('settings-open');
  }


  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }


  /**
   * Reset the menus then hilight current active menu item
   */
  _activateMenuDropdown() {
    this.resetMenuItems();
    this.activateMenuItems();
  }


  /**
   * Resets the menus
   */
  resetMenuItems() {

    const links = document.getElementsByClassName('nav-link-ref');

    for (let i = 0; i < links.length; i++) {
      const menuItemEl = links[i];
      menuItemEl.classList.remove('mm-active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
          parentEl.classList.remove('mm-active');
          const parent2El = parentEl.parentElement;

          if (parent2El) {
            parent2El.classList.remove('mm-show');
          }

          const parent3El = parent2El.parentElement;
          if (parent3El) {
            parent3El.classList.remove('mm-active');

            if (parent3El.classList.contains('side-nav-item')) {
              const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

              if (firstAnchor) {
                firstAnchor.classList.remove('mm-active');
              }
            }

            const parent4El = parent3El.parentElement;
            if (parent4El) {
              parent4El.classList.remove('mm-show');

              const parent5El = parent4El.parentElement;
              if (parent5El) {
                parent5El.classList.remove('mm-active');
              }
            }
          }
      }
    }
    for (let i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i]['active'] = '';
    }
  };


  /**
   * Toggles the menu items
   */
  activateMenuItems() {
    const links = document.getElementsByClassName('nav-link-ref');

    let menuItemEl = null;

    for (let i = 0; i < this.menuItems.length; i++) {
      // tslint:disable-next-line: no-string-literal
        // if (window.location.href === links[i]['href']) {
        if(window.location.href.replace(this.storage.geturl()+"#","") === this.menuItems[i]['link']){
            // menuItemEl = links[i];
            this.menuItems[i]['active'] = 'mm-active';
            break;
        }
    }

    // if (menuItemEl) {
    //     menuItemEl.classList.add('mm-active');
    //     const parentEl = menuItemEl.parentElement;

    //     if (parentEl) {
    //         parentEl.classList.add('mm-active');

    //         const parent2El = parentEl.parentElement;
    //         if (parent2El) {
    //             parent2El.classList.add('mm-show');
    //         }

    //         const parent3El = parent2El.parentElement;
    //         if (parent3El) {
    //             parent3El.classList.add('mm-active');

    //             if (parent3El.classList.contains('side-nav-item')) {
    //                 const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

    //                 if (firstAnchor) {
    //                     firstAnchor.classList.add('mm-active');
    //                 }
    //             }

    //             const parent4El = parent3El.parentElement;
    //             if (parent4El) {
    //                 parent4El.classList.add('mm-show');

    //                 const parent5El = parent4El.parentElement;
    //                 if (parent5El) {
    //                     parent5El.classList.add('mm-active');
    //                 }
    //             }
    //         }
    //     }
    // }

  };

  // activateMenuItems() {

  //   const links = document.getElementsByClassName('nav-link-ref');

  //   let menuItemEl = null;

  //   for (let i = 0; i < links.length; i++) {
  //     // tslint:disable-next-line: no-string-literal
  //       if (window.location.pathname === links[i]['pathname']) {
  //           menuItemEl = links[i];
  //           break;
  //       }
  //   }

  //   if (menuItemEl) {
  //       menuItemEl.classList.add('mm-active');
  //       const parentEl = menuItemEl.parentElement;

  //       if (parentEl) {
  //           parentEl.classList.add('mm-active');

  //           const parent2El = parentEl.parentElement;
  //           if (parent2El) {
  //               parent2El.classList.add('mm-show');
  //           }

  //           const parent3El = parent2El.parentElement;
  //           if (parent3El) {
  //               parent3El.classList.add('mm-active');

  //               if (parent3El.classList.contains('side-nav-item')) {
  //                   const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

  //                   if (firstAnchor) {
  //                       firstAnchor.classList.add('mm-active');
  //                   }
  //               }

  //               const parent4El = parent3El.parentElement;
  //               if (parent4El) {
  //                   parent4El.classList.add('mm-show');

  //                   const parent5El = parent4El.parentElement;
  //                   if (parent5El) {
  //                       parent5El.classList.add('mm-active');
  //                   }
  //               }
  //           }
  //       }
  //   }
  // };


}
