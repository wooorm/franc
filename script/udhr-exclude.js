/* Some languages are ignored, no matter what
 * `threshold` is chosen. */
const udhrExclude = [
  /* Using both results in incorrect results.
   * `build.js` adds support for `fas`. */
  'prs' /* Western Persian */,
  'pes' /* Dari */,
  /* `cbs` and `prq` have the same entries:
   *
   * - http://www.ohchr.org/EN/UDHR/Pages/Language.aspx?LangID=cbs
   * - http://www.ohchr.org/EN/UDHR/Pages/Language.aspx?LangID=cpp
   * - http://www.unicode.org/udhr/d/udhr_cbs.txt
   * - http://www.unicode.org/udhr/d/udhr_prq.txt
   *
   * To date (9 november, 2014), I have no idea which
   * is which, thus I cannot guarantee if they will
   * work.
   *
   * I've sent an e-mail out to OHCHR and am waiting
   * for an answer. */
  'cbs',
  'prq',

  /* Same UDHR as ckb (Central Kurdish), but with less speakers. */
  'kmr' /* Northern Kurdish */,

  // Macedo-Romanian (rup) and Vlax Romani (rmy) have the same UDHR, and same
  // number of speakers (1.5m), so ignore one.
  'rup'
]

export default udhrExclude
