# Theme Testing Checklist

## Visual Regression Testing for Video Prompt Builder Themes

### Prerequisites

- [ ] Server running on http://localhost:3000
- [ ] Navigate to http://localhost:3000/theme-test

### Theme Configuration Testing

#### 1. MONOGEIST Theme

**Light Mode:**

- [ ] Select "MonoGeist" from the Color Scheme dropdown
- [ ] Ensure Light Mode is active
- [ ] Verify:
  - [ ] Sharp corners (no border radius)
  - [ ] Monochrome color palette
  - [ ] Minimal shadows
  - [ ] Clean, technical aesthetic
  - [ ] Cards have proper borders
  - [ ] Typography uses Geist Mono font

**Dark Mode:**

- [ ] Click "Dark Mode" button
  - [ ] Verify smooth transition animation
  - [ ] Check dark backgrounds
  - [ ] Ensure text contrast is maintained
  - [ ] Verify all components remain visible

#### 2. KODAMA GROVE Theme

**Light Mode:**

- [ ] Select "Kodama Grove" from dropdown
- [ ] Verify:
  - [ ] Green/nature color palette
  - [ ] Rounded corners (0.425rem radius)
  - [ ] Organic shadows
  - [ ] Merriweather serif font
  - [ ] Warm, natural feel

**Dark Mode:**

- [ ] Toggle to dark mode
  - [ ] Verify dark green tones
  - [ ] Check component visibility
  - [ ] Ensure nature theme persists

#### 3. CYBER PUNK Theme

**Light Mode:**

- [ ] Select "Cyberpunk" from dropdown
- [ ] Verify:
  - [ ] Purple/pink color scheme
  - [ ] Medium rounded corners (0.5rem)
  - [ ] Modern shadows
  - [ ] Outfit sans-serif font
  - [ ] Futuristic aesthetic

**Dark Mode:**

- [ ] Toggle to dark mode
  - [ ] Verify neon-like colors
  - [ ] Check dark purple backgrounds
  - [ ] Ensure cyberpunk feel is maintained

### Component Testing Across All Themes

For each theme (both light and dark modes), verify:

#### Cards

- [ ] Border styles match theme
- [ ] Shadow effects are appropriate
- [ ] Background colors are correct
- [ ] Text is readable
- [ ] Nested cards display properly

#### Buttons

- [ ] All variants display correctly:
  - [ ] Default
  - [ ] Secondary
  - [ ] Outline
  - [ ] Ghost
  - [ ] Link
  - [ ] Destructive
- [ ] Hover states work
- [ ] Focus rings are visible
- [ ] Size variations render properly

#### Dropdowns (Select)

- [ ] Trigger button styled correctly
- [ ] Dropdown panel has proper background
- [ ] Selected item is highlighted
- [ ] Scrolling works if needed
- [ ] Icons display properly

#### Popovers

- [ ] Trigger interaction works
- [ ] Popover background matches theme
- [ ] Border and shadow are correct
- [ ] Content is readable
- [ ] Positioning is accurate

#### Forms

- [ ] Input fields have correct borders
- [ ] Focus states are visible
- [ ] Disabled states are clear
- [ ] Labels are readable
- [ ] Textarea resizes properly

#### Overlays

- [ ] Dialog backdrop opacity is appropriate
- [ ] Modal content is properly styled
- [ ] Command palette search works
- [ ] Tooltips appear on hover

### Animation & Transitions

- [ ] Theme switching has smooth transition
- [ ] Dark mode toggle animation works
- [ ] No flickering during transitions
- [ ] View transitions work (if supported)

### Accessibility

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader labels are present

### Performance

- [ ] Theme switching is instant
- [ ] No layout shifts during transitions
- [ ] Animations are smooth (60fps)
- [ ] Page remains responsive

### Browser Testing

Test in multiple browsers:

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Known Issues to Watch For

1. CSS variables not updating
2. Components not inheriting theme colors
3. Transition artifacts
4. Font loading delays
5. Dark mode persistence

### Final Verification

- [ ] Copy theme info button works
- [ ] Theme preferences persist on reload
- [ ] All components maintain consistency
- [ ] No console errors
- [ ] Overall polish and quality

## Notes

- Document any issues found
- Take screenshots of any rendering problems
- Note which browser/OS combination was used
