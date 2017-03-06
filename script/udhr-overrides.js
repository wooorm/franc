/* Get a UDHR key from an ISO code. */
/* It doesnt matter which one we take, simplified
 * or traditional. It all chinese, and all Han-script
 * characters. */
exports.cmn = ['cmn_hans'];

/* Seems to be most popular in Nigeria:
 * http://www.ethnologue.com/language/hau */
exports.hau = ['hau_NG'];

/* Monotonic Greek is modern greek. */
exports.ell = ['ell_monotonic'];

/* More popular, Farsi/Persian, instead of Dari
 * http://www.ohchr.org/EN/UDHR/Pages/Language.aspx?LangID=prs1 */
exports.pes = ['pes_1'];

/* Asante: 2,800,000; Fante: 1,900,000; Akuapem: 555,000.
 * http://www.ethnologue.com/language/aka */
exports.aka = ['aka_asante'];

/* Languages with one dated translation, pick the
 * newest */
exports.deu = ['deu_1996'];
exports.ron = ['ron_2006'];

/* Pick European Portuguese, maybe not fair, will
 * have to investigate. */
exports.por = ['por_PT'];

/* No real reason.
 * http://www.ethnologue.com/language/nya */
exports.nya = ['nya_chinyanja'];

/* It says “popular” in the name? */
exports.hat = ['hat_popular'];

/* There’s many translated OCIs, let’s use the first though. */
exports.oci = ['oci'];
