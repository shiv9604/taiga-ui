import {TuiIdentityMatcher, TuiMatcher, TuiStringHandler} from '@taiga-ui/cdk/types';
import {TUI_DEFAULT_STRINGIFY} from './stringify';

/**
 * Default handler for matching stringified version of an item and a search query
 * @param item arbitrary element to match with a string
 * @param search search query
 * @param stringify handler to turn item into a string
 */
export const TUI_DEFAULT_MATCHER: TuiMatcher<any> = (
    item,
    search: string,
    stringify: TuiStringHandler<any> = TUI_DEFAULT_STRINGIFY,
) => stringify(item).toLowerCase().includes(search.toLowerCase());

/**
 * Default handler for strict matching stringified version of an item and a search query
 * @param item arbitrary element to match with a string
 * @param search search query
 * @param stringify handler to turn item into a string
 */
export const TUI_STRICT_MATCHER: TuiMatcher<any> = (
    item,
    search: string,
    stringify: TuiStringHandler<any> = TUI_DEFAULT_STRINGIFY,
) => stringify(item).toLowerCase() === search.toLowerCase();

/**
 * Default handler to match equality of two elements
 * @param item1 first element
 * @param item2 second element
 */
export const TUI_IDENTITY_MATCHER: TuiIdentityMatcher<any> = (item1, item2) =>
    item1 === item2;
