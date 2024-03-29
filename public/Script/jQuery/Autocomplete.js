(function(e) {
    e.fn.autocomplete = function(t) {
        var n = -1;
        var r = [];
        t = e.extend({
            hints: [],
            placeholder: "Search",
            width: 200,
            height: 16,
            showButton: true,
            buttonText: "Search",
            onSubmit: function(e) {},
            onBlur: function() {}
        }, t);
        this.each(function() {
            var i = e("<div></div>").addClass("autocomplete-container").css("height", t.height * 2);
            var s = e('<input type="text" autocomplete="off" name="query">').attr("placeholder", t.placeholder).addClass("autocomplete-input").css({
                width: t.width,
                height: t.height
            });
            if (t.showButton) {
                s.css("border-radius", "3px 0 0 3px")
            }
            var o = e("<div></div>").addClass("proposal-box").css("width", t.width + 18).css("top", s.height() + 20);
            var u = e("<ul></ul>").addClass("proposal-list");
            o.append(u);
            s.keydown(function(i) {
                switch (i.which) {
                    case 38:
                        i.preventDefault();
                        e("ul.proposal-list li").removeClass("selected");
                        if (n - 1 >= 0) {
                            n--;
                            e("ul.proposal-list li:eq(" + n + ")").addClass("selected")
                        } else {
                            n = -1
                        }
                        break;
                    case 40:
                        i.preventDefault();
                        if (n + 1 < r.length) {
                            e("ul.proposal-list li").removeClass("selected");
                            n++;
                            e("ul.proposal-list li:eq(" + n + ")").addClass("selected")
                        }
                        break;
                    case 13:
                        if (n > -1) {
                            var o = e("ul.proposal-list li:eq(" + n + ")").html();
                            s.val(o)
                        }
                        n = -1;
                        u.empty();
                        t.onSubmit(s.val());
                        break;
                    case 27:
                        n = -1;
                        u.empty();
                        s.val("");
                        break
                }
            });
            s.bind("change paste keyup", function(i) {
                if (i.which != 13 && i.which != 27 && i.which != 38 && i.which != 40) {
                    r = [];
                    n = -1;
                    u.empty();
                    if (s.val() != "") {
                        var o = "^" + s.val() + ".*";
                        u.empty();
                        for (var a in t.hints) {
                            if (t.hints[a].match(o)) {
                                r.push(t.hints[a]);
                                var f = e("<li></li>").html(t.hints[a]).addClass("proposal").click(function() {
                                    s.val(e(this).html());
                                    u.empty();
                                    t.onSubmit(s.val())
                                }).mouseenter(function() {
                                    e(this).addClass("selected")
                                }).mouseleave(function() {
                                    e(this).removeClass("selected")
                                });
                                u.append(f)
                            }
                        }
                    }
                }
            });
            s.blur(function(e) {
                n = -1;
                t.onBlur()
            });
            i.append(s);
            i.append(o);
            if (t.showButton) {
                var a = e("<div></div>").addClass("autocomplete-button").html(t.buttonText).css({
                    height: t.height + 2,
                    "line-height": t.height + "px"
                }).click(function() {
                    u.empty();
                    t.onSubmit(s.val())
                });
                i.append(a)
            }
            e(this).append(i);
            if (t.showButton) {
                i.css("width", t.width + a.width() + 50)
            }
        });
        return this
    }
})(jQuery)
