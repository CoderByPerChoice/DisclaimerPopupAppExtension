import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as strings from 'DisclaimerPopupApplicationCustomizerStrings';
import DialogBlockingExample from '../disclaimerPopup/Popup/Popup';
const LOG_SOURCE: string = 'DisclaimerPopupApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IDisclaimerPopupApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class DisclaimerPopupApplicationCustomizer
  extends BaseApplicationCustomizer<IDisclaimerPopupApplicationCustomizerProperties> {
  private _topPlaceholder: PlaceholderContent | undefined;
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // Added to handle possible changes on the existence of placeholders.  
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    // Call render method for generating the HTML elements.  
    this._renderPlaceHolders();
    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {
    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      if (this.properties) {
        if (this._topPlaceholder.domElement) {
          //Popup
          const elem: React.ReactElement<any> = React.createElement(
            DialogBlockingExample
          );

          ReactDOM.render(
            elem, this._topPlaceholder.domElement);
        }
      }
    }
  }
  private _onDispose(): void {
    console.log('[CustomHeaderFooterApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}
