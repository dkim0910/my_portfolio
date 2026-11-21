(function() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Email protection & Copy to Clipboard
    var u = 'hello+contact';
    var d = 'nelera.net';
    var email = u + '@' + d;
    document.querySelectorAll('[data-contact="email"]').forEach(function(el) {
        var originalText = el.textContent;
        var resetTimer;
        el.href = 'mailto:' + email;
        el.addEventListener('click', function(e) {
            if (e.shiftKey || e.metaKey || e.ctrlKey) return; // Allow normal mailto if modifier keys are held
            // No clipboard API (older browsers, non-HTTPS): let the mailto link do its job.
            if (!navigator.clipboard || !navigator.clipboard.writeText) return;
            e.preventDefault();
            navigator.clipboard.writeText(email).then(function() {
                el.textContent = 'Email copied!';
                el.classList.add('btn-primary');
                el.classList.remove('btn-secondary');
                clearTimeout(resetTimer);
                resetTimer = setTimeout(function() {
                    el.textContent = originalText;
                    el.classList.remove('btn-primary');
                    el.classList.add('btn-secondary');
                }, 2000);
            }).catch(function() {
                // Copy was refused (permissions, lost focus): fall back to opening the mail client.
                window.location.href = el.href;
            });
        });
    });

    // Code cycling
    var snippets = [
        { lang: 'JavaScript', code: '<span class="kw">function</span> <span class="fn">helloWorld</span>() {\n  <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">"Hello, World!"</span>);\n}\n\n<span class="fn">helloWorld</span>();' },
        { lang: 'Dart', code: '<span class="kw">void</span> <span class="fn">main</span>() {\n  <span class="fn">print</span>(<span class="str">\'Hello, World!\'</span>);\n}' },
        { lang: 'TypeScript', code: '<span class="kw">const</span> <span class="fn">helloWorld</span> = (<span class="ty">name</span>: <span class="ty">string</span>): <span class="ty">void</span> =&gt; {\n  <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">`Hello, ${name}!`</span>);\n};\n\n<span class="fn">helloWorld</span>(<span class="str">"World"</span>);' },
        { lang: 'Java', code: '<span class="kw">public class</span> <span class="ty">Main</span> {\n  <span class="kw">public static void</span> <span class="fn">main</span>(<span class="ty">String</span>[] args) {\n    System.out.<span class="fn">println</span>(<span class="str">"Hello, World!"</span>);\n  }\n}' },
        { lang: 'SQL', code: '<span class="kw">SELECT</span> <span class="str">\'Hello, World!\'</span>\n<span class="kw">AS</span> <span class="ty">greeting</span>\n<span class="kw">FROM</span> <span class="ty">dual</span>;' },
        { lang: 'HTML', code: '<span class="kw">&lt;!DOCTYPE</span> <span class="ty">html</span><span class="kw">&gt;</span>\n<span class="kw">&lt;h1&gt;</span><span class="str">Hello, World!</span><span class="kw">&lt;/h1&gt;</span>' },
        { lang: 'CSS', code: '<span class="ty">body</span>::<span class="fn">after</span> {\n  <span class="kw">content</span>: <span class="str">"Hello, World!"</span>;\n  <span class="kw">color</span>: <span class="str">#ea580c</span>;\n}' }
    ];
    var codeBlock = document.getElementById('codeBlock');
    var codeLang = document.getElementById('codeLang');
    var codeIdx = 0;
    function showSnippet() {
        if (!codeBlock || !codeLang) return;
        codeBlock.innerHTML = snippets[codeIdx].code;
        codeLang.textContent = snippets[codeIdx].lang;
        codeBlock.classList.remove('code-fade-in');
        void codeBlock.offsetWidth;
        codeBlock.classList.add('code-fade-in');
        codeIdx = (codeIdx + 1) % snippets.length;
    }
    if (codeBlock && codeLang) {
        showSnippet();
        // Visitors who asked for reduced motion get one static snippet instead of a loop;
        // a hidden tab doesn't need to keep swapping either.
        if (!reduceMotion) {
            setInterval(function() {
                if (!document.hidden) showSnippet();
            }, 4500);
        }
    }

    // Navbar scroll effect & Progress bar & Scroll Top
    var nav = document.querySelector('.nav');
    var progressBar = document.getElementById('progress-bar');
    var scrollTopBtn = document.getElementById('scroll-top');
    var ticking = false;

    function updateScrollUi() {
        ticking = false;
        var scrollY = window.scrollY;

        // Nav background
        if (nav) {
            nav.classList.toggle('scrolled', scrollY > 20);
        }

        // Progress bar (a page shorter than the viewport has nothing to scroll)
        if (progressBar) {
            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrolled = height > 0 ? Math.min(100, (scrollY / height) * 100) : 0;
            progressBar.style.width = scrolled + '%';
        }

        // Scroll top button
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', scrollY > 500);
        }
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateScrollUi);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Arriving on an anchor (/#projects) or a restored scroll position never fires 'scroll'.
    updateScrollUi();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    // Project Filtering
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projects = document.querySelectorAll('[data-category]');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = btn.getAttribute('data-filter');

            // Update buttons
            filterBtns.forEach(function(b) {
                var isActive = b === btn;
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            // Filter projects
            projects.forEach(function(project) {
                var category = project.getAttribute('data-category');
                project.classList.toggle('hidden', filter !== 'all' && category !== filter);
            });

            // Hiding sections changes the page height, so the progress bar is stale.
            updateScrollUi();
        });
    });

})();
