# DeBot Web Embedding Contest

### How to install
Go to the iframe [generator page](https://debot.ever.arsen12.ru/generate), set the address and the debot network, get the html code of the item and embed it on your website.

### Customization
To change the color palette, CSS variables are used. Light and dark themes are
available by default. By choosing the custom option, you can create your own
theme.

background colors:

`--chat-background-color`

`--chat-background-secondary-color`

header background colors:

`--chat-header-background-color`

`--chat-background-border-color`

Plain and primary text colors:

`--chat-primary-text-color`

`--chat-primary-inverted-text-color`

`--chat-default-text-color`

`--chat-default-secondary-text-color`

`--chat-default-secondary-2-text-color`

Input error message text color:

`--chat-input-error-color`

Camera unavailable message colors:

`--chat-camera-not-ready-background-color`

`--chat-camera-not-ready-text-color`

Colors of messages from debot / user:

`--debot-message-bubble-color`

`--debot-message-text-color`

`--user-message-bubble-color`

`--user-message-text-color`

Colors of buttons in confirm input:

`--confirm-yes-bubble-color`

`--confirm-yes-text-color`

`--confirm-no-bubble-color`

`--confirm-no-text-color`

Menu button colors:

`--chat-button-border-color`

`--chat-button-text-color`

`--chat-button-background-color`


### Advanced use. Interception of interface calls.

If extended mode is enabled, there is an opportunity for interaction between the iframe debot and the user's site. When the debot calls the interface marked as intercepted, the input field will not be displayed inside the iframe, instead a message about the interface triggering will be sent to the site page.

When a site receives a message from an iframe, it can render input elements on its own and wait for input from the user, or it can immediately send a response "on behalf of the user". The first option is used for advanced styling / hiding controls if changing the color palette is not enough. The second option is used to autocomplete data.

The example at the beginning of the description demonstrates the work of intercepting interface calls, if you call CountyInput, DateTimeInput, QrCodeInput, the pop-up window will appear not inside the iframe, but outside by intercepting the corresponding calls

**About security**: not all interface outputs are available for interception. For example, you cannot start a debot, sign and confirm the sending of a transaction "on behalf of the user" This is done to prevent obvious attacks on withdrawing funds without the user's knowledge.

### New DInterface: AutoCompleteInput

The new interface is proposed to be used as an alternative to entering "on behalf of the user" described in the previous paragraph.

`function get(uint32 answerId, bytes id, bytes values) external returns (AutoCompleteStatus status, ...args);`

`id` - string identifier of the requested data

`values` - a string with the requested data of type `value_name:value_type:default_value`, if there are several requested variables, they must be listed separated by commas.
When calling this interface, it should get the requested data by id from the storage, either in any other way, or return the default values. An example of a new interface is now in debot:

`0:5f05095ff76770295995bfbe2e9f0f3d7e9d07d3756e553354b84766606b1095`
