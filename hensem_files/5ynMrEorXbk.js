;/*FB_PKG_DELIM*/

__d("PolarisGenericOnboardingUnit.react",["cx","PolarisIGCoreButton","joinClasses","react"],(function(a,b,c,d,e,f,g,h){"use strict";var i=d("react");function a(a){return i.jsx("section",{className:c("joinClasses")("_aa55",a.className),children:i.jsxs("div",{className:"_aa56",children:[i.jsx("div",{className:"_aa57",children:a.icon}),i.jsx("div",{className:"_aa58",children:a.headerText}),i.jsx("div",{className:"_aa59",children:a.bodyText}),!a.hideAction&&i.jsx(c("PolarisIGCoreButton"),{disabled:a.buttonDisabled,loading:a.isProcessing,onClick:a.onButtonClick,children:a.buttonText}),a.footer]})})}a.displayName=a.name+" [from "+f.id+"]";a.defaultProps={hideAction:!1};g["default"]=a}),98);