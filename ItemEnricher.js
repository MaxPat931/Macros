/// A World Script to add custom enrichers to roll Items
Hooks.once("init", () => {
    CONFIG.TextEditor.enrichers.push({
        pattern: /\[\[\/(?<type>item) (?<config>[^\]]+)]](?:{(?<label>[^}]+)})?/gi,
        enricher: enrichString
      });
    
      document.body.addEventListener("click", rollAction);

/**
 * Parse the enriched string and provide the appropriate content.
 * @param {RegExpMatchArray} match       The regular expression match result.
 * @param {EnrichmentOptions} options    Options provided to customize text enrichment.
 * @returns {Promise<HTMLElement|null>}  An HTML element to insert in place of the matched text or null to
 *                                       indicate that no replacement should be made.
 */
async function enrichString(match, options) {
    let { type, config, label } = match.groups;
    config = parseConfig(config, match.input);
    config.input = match[0];
    switch ( type.toLowerCase() ) {
      case "item": return enrichItem(config, label, options);
    }
    return match.input;
  }

/* -------------------------------------------- */

/**
 * Parse a roll string into a configuration object.
 * @param {string} match  Matched configuration string.
 * @returns {object}
 */
function parseConfig(match) {
    const config = { values: [] };
    for ( const part of match.split(" ") ) {
      if ( !part ) continue;
      const [key, value] = part.split("=");
      const valueLower = value?.toLowerCase();
      if ( value === undefined ) config.values.push(key);
      else if ( ["true", "false"].includes(valueLower) ) config[key] = valueLower === "true";
      else if ( Number.isNumeric(value) ) config[key] = Number(value);
      else config[key] = value;
    }
    return config;
  }

/* -------------------------------------------- */
/*  Enrichers                                   */
/* -------------------------------------------- */

/**
 * Enrich an item use link to roll an item on the selected token. 
 * @param {string[]} config            Configuration data.
 * @param {string} [label]             Optional label to replace default text.
 * @param {EnrichmentOptions} options  Options provided to customize text enrichment.
 * @returns {HTMLElement|null}         An HTML link if the check could be built, otherwise null.
 *
 * @example Use a Heavy Crossbow:
 * ```[[/item Heavy Crossbow]]```
 * becomes
 * ```html
 * <a class="roll-action" data-type="item">
 *   <i class="fa-solid fa-dice-d20"></i> Heavy Crossbow
 * </a>
 * ```
*/

async function enrichItem(config, label) {
  const givenItem = config.values.join(' ');
  if ( !label ) {
    label = givenItem;}

    return createRollLink(label, { type: "item", rollItem: givenItem, ...config });
  }

/* -------------------------------------------- */
/*  Actions                                     */
/* -------------------------------------------- */

/**
 * Perform the provided roll action.
 * @param {Event} event  The click event triggering the action.
 * @returns {Promise|void}
 */
function rollAction(event) {
    const target = event.target.closest(".roll-link");
    if ( !target ) return;
    event.stopPropagation();
  
    const { type } = target.dataset;

    switch ( type ) {
      case "item":
        return dnd5e.documents.macro.rollItem(target.dataset.rollItem);
    }
  }


/* -------------------------------------------- */

/**
 * Add a dataset object to the provided element.
 * @param {HTMLElement} element  Element to modify.
 * @param {object} dataset       Data properties to add.
 * @private
 */
function _addDataset(element, dataset) {
  for ( const [key, value] of Object.entries(dataset) ) {
    if ( !["input", "values"].includes(key) && value ) element.dataset[key] = value;
  }
}

/* -------------------------------------------- */

/**
 * Create a rollable link.
 * @param {string} label    Label to display.
 * @param {object} dataset  Data that will be added to the link for the rolling method.
 * @returns {HTMLElement}
 */
function createRollLink(label, dataset) {
  const link = document.createElement("a");
  link.classList.add("roll-link");
  _addDataset(link, dataset);
  link.innerHTML = `<i class="fa-solid fa-dice-d20"></i> ${label}`;
  return link;
}

});
