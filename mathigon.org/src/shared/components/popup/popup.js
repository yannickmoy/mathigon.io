// =============================================================================
// Popup Component
// (c) Mathigon
// =============================================================================
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElementView, register } from '@mathigon/boost';
let Popup = class Popup extends CustomElementView {
    constructor() {
        super(...arguments);
        this.isOpen = false;
    }
    ready() {
        this.animation = this.attr('animation') || 'pop';
        this.$bubble = this.$('.popup-body');
        this.$bubble.hide();
        const $target = this.$('.popup-target');
        $target.on('click', () => this.toggle());
        this.on('clickOutside', () => this.close());
        for (const $a of this.$bubble.$$('a'))
            $a.on('click', () => this.close());
    }
    toggle() {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    open() {
        if (this.isOpen)
            return;
        this.isOpen = true;
        this.addClass('active');
        this.$bubble.enter(this.animation, 200);
    }
    close() {
        if (!this.isOpen)
            return;
        this.isOpen = false;
        this.removeClass('active');
        this.$bubble.exit(this.animation, 200);
    }
};
Popup = __decorate([
    register('x-popup')
], Popup);
export { Popup };
