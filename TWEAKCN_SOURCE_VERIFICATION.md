# TweakCN Source Verification & MonoGeist Context

## Key Findings - MUST REMEMBER

### 1. TweakCN Repository Location
- **Correct Repository**: `jnsahaj/tweakcn` (NOT tweakcn/tweakcn or ui-cn/tweakcn-ui)
- **URL**: https://github.com/jnsahaj/tweakcn
- **Description**: "A visual no-code theme editor for shadcn/ui components"
- **Previous Search Attempts Failed**: Due to incorrect repository paths

### 2. MonoGeist Theme Context - CRITICAL INSIGHT
- **MonoGeist is a CUSTOM theme** - not part of the default tweakcn themes
- **It was likely created/customized specifically for this Video Prompt Builder project**
- **Therefore**: We won't find "MonoGeist" in the tweakcn repository
- **Source of Truth**: The existing `/Users/andrewvoirol/Dev/DevProjects/Video-Prompt-Builder/tweakcn-design-tokens.json` file appears to be our authoritative reference

### 3. Current Task Scope Clarification NEEDED
The task mentions "tweakcn's implementation" but given that MonoGeist is custom:

**QUESTIONS FOR USER:**
1. Should we match the base tweakcn Mono theme styling patterns/architecture?
2. Or should we refine the existing custom MonoGeist theme in this project?
3. What specific "tweakcn implementation" aspects should we replicate?
   - Component structure patterns?
   - CSS variable architecture?
   - Design system principles?
   - Specific visual elements (toggle animations, scrollbars, etc.)?

### 4. What We DO Have
- Custom MonoGeist theme implemented in `app/globals.css`
- Design tokens file: `tweakcn-design-tokens.json` (appears to be extracted/normalized from our implementation)
- Component implementations that need "hardening"

### 5. Recommended Approach
Given the custom nature of MonoGeist, the task likely means:
1. **Study tweakcn's component architecture** and CSS patterns from the actual repo
2. **Apply those patterns/principles** to harden our MonoGeist components
3. **Ensure our implementation follows tweakcn's best practices** for:
   - CSS variable usage
   - Component structure
   - Border radius handling
   - Shadow systems
   - Toggle animations
   - Scrollbar styling

## CONFIRMED SCOPE & APPROACH

### User Clarification Received:
- **REMOVE MonoGeist** - too troublesome, replace with standard Mono theme from tweakcn
- **Use 3 standard themes** instead of custom MonoGeist
- **Option A Confirmed**: Study tweakcn architecture and apply their patterns
- **Gradient backgrounds**: From tweakcn frontend (https://tweakcn.com/editor/theme) + codebase research

### Component Strategy:
1. **ShadCN first** - Use MCP Tools for components when possible
2. **TweakCN for customizations** - CURL first, then local clone if more efficient
3. **TweakCN animations and toggle** - Use their dark mode animations and toggle component

### Testing Strategy:
- **MCP Puppeteer tools** for automated testing
- **HTML screenshot compilation** for visual verification
- **Test URL**: https://tweakcn.com/editor/theme (if navigable)

## Next Steps
1. **Get standard Mono theme** from tweakcn via CURL
2. **Replace MonoGeist** with standard Mono theme
3. **Harden components** using tweakcn patterns
4. **Implement tweakcn toggle/animations**
5. **Add scrollbar styling**
6. **Test with MCP Puppeteer tools**
