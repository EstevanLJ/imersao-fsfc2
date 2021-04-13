import { Button, Grid, MenuItem, Select } from "@material-ui/core";
import { Loader } from "google-maps";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { getCurrentPosition } from "../utils/geolocation";
import { makeCarIcon, makeMarkerIcon } from "../utils/map";
import { Route } from "../utils/route";

const API_URL = process.env.REACT_APP_API_URL;

const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);

type Props = {};

export const Mapping = (props: Props) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeIdSelected, setRouteIdSelected] = useState<string>("");
  const mapRef = useRef<google.maps.Map>();

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((data) => data.json())
      .then((data) => setRoutes(data));
  }, []);

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true }),
      ]);

      const divMap = document.getElementById("map") as HTMLElement;
      mapRef.current = new google.maps.Map(divMap, {
        zoom: 15,
        center: position,
      });
    })();
  }, []);

  const startRoute = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const route = routes.find((route) => route._id === routeIdSelected);

      new google.maps.Marker({
        position: route?.startPosition,
        map: mapRef.current,
        icon: makeCarIcon("#000"),
      });

      new google.maps.Marker({
        position: route?.endPosition,
        map: mapRef.current,
        icon: makeMarkerIcon("#244232"),
      });
    },
    [routeIdSelected, routes]
  );

  return (
    <Grid container style={{ height: "100%", width: "100%" }}>
      <Grid item xs={12} sm={3}>
        <form onSubmit={startRoute}>
          <Select
            fullWidth
            value={routeIdSelected}
            displayEmpty
            onChange={(event) => setRouteIdSelected(event.target.value + "")}
          >
            <MenuItem value="">
              <em>Selecione uma corrida</em>
            </MenuItem>
            {routes.map((route, key) => (
              <MenuItem key={key} value={route._id}>
                {route.title}
              </MenuItem>
            ))}
          </Select>
          <Button type="submit" color="primary" variant="contained">
            Iniciar uma corrida
          </Button>
        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id="map" style={{ height: "100%", width: "100%" }}></div>
      </Grid>
    </Grid>
  );
};
