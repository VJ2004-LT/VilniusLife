package com.vl.vilniuslife.model;

import java.util.List;

public class RouteSafetyRequest {

    private List<Street> route;

    public RouteSafetyRequest(List<Street> route) {
        this.route = route;
    }

    public List<Street> getRoute() {
        return route;
    }

    public void setRoute(List<Street> route) {
        this.route = route;
    }
}
