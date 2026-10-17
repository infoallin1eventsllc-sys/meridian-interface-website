// Copy buttons on the business card (/card/). Kept out of index.html because
// the site's security policy does not run inline scripts.
document.addEventListener('click', function (e) {
  var b = e.target.closest('button.copy');
  if (!b) return;
  var text = b.getAttribute('data-copy');
  var done = function (label) {
    b.textContent = label;
    setTimeout(function () { b.textContent = 'Copy'; }, 1600);
  };
  var select = function () {
    var v = b.previousElementSibling;
    var r = document.createRange();
    r.selectNodeContents(v);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
    done('Selected');
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { done('Copied'); }, select);
  } else {
    select();
  }
});
