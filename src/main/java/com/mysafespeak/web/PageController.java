package com.mysafespeak.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Serves every page in src/main/resources/templates.
 *
 * The templates link to each other with plain relative hrefs
 * (e.g. "login.html", "admin-dashboard.html", "reporter/reporter-dashboard.html"),
 * so the URL structure below mirrors the templates/ folder structure
 * 1:1: a top-level file maps to "/{page}.html" and a role-folder file
 * maps to "/{role}/{page}.html". Static assets under
 * src/main/resources/static/assets are served automatically by Spring
 * Boot at /assets/** — no extra config needed there.
 */
@Controller
public class PageController {

    @GetMapping({"/", "/landing.html"})
    public String landing() {
        return "landing";
    }

    @GetMapping("/{page}.html")
    public String topLevelPage(@PathVariable String page) {
        return page;
    }

    @GetMapping("/{role}/{page}.html")
    public String rolePage(@PathVariable String role, @PathVariable String page) {
        return role + "/" + page;
    }

}
