// import { mainBack, mainFront, specialBack, specialFront } from "./colors.js"

export const addCustomStyleTag = () => {
  const newStyle = document.createElement("style")
  newStyle.setAttribute('type', 'text/css')
  // classToColor background, color, padding, margin
  newStyle.innerHTML = `
    body {
      margin-top: 0;
    }

    /* Increase main font-size */
    .ghx-issue-fields .ghx-summary .ghx-inner {
      font-size: 1.8em;
    }

    /* Begin flattening header rows */
    .ghx-controls-plan, .ghx-header-compact .ghx-controls-report, .ghx-controls-work {
      min-height: 0px;
      height: 2em;
    }
    .ghx-rapid-views #gh #ghx-work #ghx-pool-column #ghx-column-headers .ghx-column {
      padding: 0px 8px;
    }
    .ghx-swimlane-header .ghx-heading {
      margin: 2px 0;
    }
    .ghx-rapid-views #gh #ghx-work #ghx-pool-column .ghx-swimlane .ghx-swimlane-header {
      top: 25px;
    }
    /* End   flattening header rows */

    .ghx-issue {
      padding: 2px 10px;
    }
    .ghx-issue .ghx-highlighted-fields,
    .ghx-issue .ghx-card-footer {
      margin-top: 2px;
    }
    .ghx-summary {
      margin-top: -5px;
    }

    .ghx-header-compact #ghx-operations {
      padding-top: 0px;
    }

    .ghx-issue .ghx-extra-fields {
      margin-top: 2px;
    }

    .ghx-issue .ghx-key-link {
      font-size: 16px;
      margin: -5px 0px -6px;
    }

    /* Increase font-size in tooltip */
    .aui-tooltip.tipsy {
      font-size:   1.5em;
      line-height: 1.6em;
    }
  `
  document.head.appendChild(newStyle)
}