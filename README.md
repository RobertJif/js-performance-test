GC have been causing problem even for static typed multi-threaded language golang
as we can see here https://discord.com/blog/why-discord-is-switching-from-go-to-rust
this is worse in javascript
there are 3 performance test js file that you can test and see for yourself
how one run of a function did not tell a story of how fast logic is in javascript
10_000 run is not much compared to how much our component rerender in big application
these test will show you in one run of a function it can be faster but slowly getting slower with more run

run the file using command to see the result

> node performance.mjs

and run it command below to see how hard the GC work

> node --trace-gc performance.mjs
