(function() {
    // Email protection & Copy to Clipboard
    var u = 'geeslyhelp';
    var d = 'gmail.com';
    var email = u + '@' + d;
    document.querySelectorAll('[data-contact="email"]').forEach(function(el) {
        el.href = 'mailto:' + email;
        el.addEventListener('click', function(e) {
            if (e.shiftKey || e.metaKey || e.ctrlKey) return; // Allow normal mailto if modifier keys are held
            e.preventDefault();
            navigator.clipboard.writeText(email).then(function() {
                var originalText = el.textContent;
                el.textContent = 'Email copied!';
                el.classList.add('btn-primary');
                el.classList.remove('btn-secondary');
                setTimeout(function() {
                    el.textContent = originalText;
                    el.classList.remove('btn-primary');
                    el.classList.add('btn-secondary');
                }, 2000);
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
    showSnippet();
    setInterval(showSnippet, 4500);

    // Navbar scroll effect & Progress bar & Scroll Top
    var nav = document.querySelector('.nav');
    var progressBar = document.getElementById('progress-bar');
    var scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', function() {
        var scrollY = window.scrollY;
        
        // Nav background
        if (nav) {
            nav.classList.toggle('scrolled', scrollY > 20);
        }

        // Progress bar
        if (progressBar) {
            var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }

        // Scroll top button
        if (scrollTopBtn) {
            if (scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Project Filtering
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projects = document.querySelectorAll('[data-category]');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = btn.getAttribute('data-filter');
            
            // Update buttons
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            // Filter projects
            projects.forEach(function(project) {
                var category = project.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    project.classList.remove('hidden');
                } else {
                    project.classList.add('hidden');
                }
            });
        });
    });

})();
