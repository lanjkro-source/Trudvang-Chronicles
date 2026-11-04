/** Shared position for optional effect bonuses. Keep existing choices inside this
 * section; dynamic bonuses append here rather than at the top of the dialog. */
export const conditionalModifierSection = (content = '') => '<div class="conditional-modifiers" data-conditional-modifiers>'+content+'</div>';

/** Combat dialogs have a section per mode: use the currently visible one. */
export function activeConditionalModifierSection(root) {
 const sections=Array.from(root.querySelectorAll('[data-conditional-modifiers]'));
 return sections.find(section=>!section.closest('[hidden]'))??sections[0]??null;
}
