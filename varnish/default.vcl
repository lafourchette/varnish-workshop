vcl 4.0;

backend default {
  .host = "nginx";
  .port = "80";
}
sub vcl_recv {
  if (req.method ~ "PURGE") {
    return (purge);
  }
}
sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT "+ obj.hits;
    } else {
        set resp.http.X-Cache = "MISS";
    }
}
