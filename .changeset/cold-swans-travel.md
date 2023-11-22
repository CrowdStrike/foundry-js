---
'@crowdstrike/foundry-js': minor
---

Improve how we handle onClick for navigation. Now when adding event listener to click event:

```javascript
document.querySelector('[data-internal-links]')
      .addEventListener('click', (event) => falcon.navigation.onClick(event, '_self', 'internal'));
```

we'll call preventDefault correctly and won't throw error in the console.
