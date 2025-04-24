# =============================================================================
# benchmarks

node_restful:
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s /repo/wrk/scripts/restful.lua http://benchmarks-node:30000/users;
	mv ./wrk/output/benchmark.csv ./wrk/output/node_restful.csv;

node_graphql:
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s ./wrk/scripts/graphql.lua http://benchmarks-node:30000;
	mv ./wrk/output/benchmark.csv ./wrk/output/node_graphql.csv;

go_restful:
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s ./wrk/scripts/restful.lua http://benchmarks-go:30000/users;
	mv ./wrk/output/benchmark.csv ./wrk/output/go_restful.csv;

go_graphql:
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s ./wrk/scripts/graphql.lua http://benchmarks-go:30000;
	mv ./wrk/output/benchmark.csv ./wrk/output/go_graphql.csv;

rust_restful:
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s ./wrk/scripts/restful.lua http://benchmarks-rust:30000/users;
	mv ./wrk/output/benchmark.csv ./wrk/output/rust_restful.csv;

rust_graphql:
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s ./wrk/scripts/graphql.lua http://benchmarks-rust:30000;
	mv ./wrk/output/benchmark.csv ./wrk/output/rust_graphql.csv;




node_capture_restful:
	@CONTAINER=$$(docker ps --filter "name=benchmarks-node" --format "{{.Names}}") && \
	./wrk/scripts/monitor_container.sh restful $$CONTAINER 30 csv & \
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s /repo/wrk/scripts/restful.lua http://benchmarks-node:30000/users && \
	mv ./wrk/output/benchmark.csv ./wrk/output/node_restful.csv && \
	cp wrk/output/capture_usage_restful_benchmarks-node.csv ./public/capture_usage_restful_node.csv;

node_capture_graphql:
	@CONTAINER=$$(docker ps --filter "name=benchmarks-node" --format "{{.Names}}") && \
	./wrk/scripts/monitor_container.sh graphql $$CONTAINER 30 csv & \
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s /repo/wrk/scripts/graphql.lua http://benchmarks-node:30000 && \
	mv ./wrk/output/benchmark.csv ./wrk/output/node_graphql.csv



go_capture_restful:
	@CONTAINER=$$(docker ps --filter "name=benchmarks-go" --format "{{.Names}}") && \
	./wrk/scripts/monitor_container.sh restful $$CONTAINER 30 csv & \
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s /repo/wrk/scripts/restful.lua http://benchmarks-go:30000/users && \
	mv ./wrk/output/benchmark.csv ./wrk/output/go_restful.csv;


go_capture_graphql:
	@CONTAINER=$$(docker ps --filter "name=benchmarks-go" --format "{{.Names}}") && \
	./wrk/scripts/monitor_container.sh graphql $$CONTAINER 30 csv & \
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s /repo/wrk/scripts/graphql.lua http://benchmarks-go:30000 && \
	mv ./wrk/output/benchmark.csv ./wrk/output/go_graphql.csv;




rust_capture_restful:
	@CONTAINER=$$(docker ps --filter "name=benchmarks-rust" --format "{{.Names}}") && \
	./wrk/scripts/monitor_container.sh restful $$CONTAINER 30 csv & \
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s /repo/wrk/scripts/restful.lua http://benchmarks-rust:30000/users && \
	mv ./wrk/output/benchmark.csv ./wrk/output/rust_restful.csv;

rust_capture_graphql:
	@CONTAINER=$$(docker ps --filter "name=benchmarks-rust" --format "{{.Names}}") && \
	./wrk/scripts/monitor_container.sh graphql $$CONTAINER 30 csv & \
	docker-compose exec benchmarks-wrk wrk -t4 -c200 -d30s --latency -s /repo/wrk/scripts/graphql.lua http://benchmarks-rust:30000 && \
	mv ./wrk/output/benchmark.csv ./wrk/output/rust_graphql.csv;




# =============================================================================
# rebuild the docker image and run
# by default, this will not recompile the code if there is corresponding binary

rnode:
	make -Bs knode \
	&& export RUN=benchmarks-node \
	&& make -Bs _run;

rgo:
	make -Bs kgo \
	&& export RUN=benchmarks-go \
	&& make -Bs _run;

# also recompile the binary
rgo2:
	rm -f ./go/build/benchmarks-go \
	&& make -Bs rgo;

rrust:
	make -Bs krust \
	&& export RUN=benchmarks-rust \
	&& make -Bs _run;

# also recompile the binary
rrust2:
	rm -f ./rust/target/release/rust \
	&& make -Bs rrust;

rwrk:
	make -Bs kwrk \
	&& export RUN=benchmarks-wrk \
	&& make -Bs _run;

# kill and cleanup, then rebuild the docker image and run, for all services
run:
	make -Bs kill \
	&& export RUN="benchmarks-node benchmarks-rust benchmarks-wrk benchmarks-go" \
	&& make -Bs _run;

# shortcut to rebuild the docker image and run
_run:
	docker-compose build $(RUN) --force-rm \
	&& docker-compose up $(RUN) -d --remove-orphans;

# =============================================================================
# kill and cleanup

knode:
	export KILL=benchmarks-node \
	&& make -Bs _kill;

kgo:
	export KILL=benchmarks-go \
	&& make -Bs _kill;

krust:
	export KILL=benchmarks-rust \
	&& make -Bs _kill;

kwrk:
	export KILL=benchmarks-wrk \
	&& make -Bs _kill;

# kill and cleanup, for all services
kill:
	export KILL=benchmarks- \
	&& make -Bs _kill;

# shortcut to kill and cleanup
_kill:
	((docker kill $$(docker ps -q --no-trunc --filter name=^$(KILL)) > /dev/null 2>&1) || true) \
	&& ((docker rm -f $$(docker ps -a -q --no-trunc --filter name=^$(KILL)) > /dev/null 2>&1) || true) \
	&& ((docker rmi -f $$(docker images -f "dangling=true" -q --no-trunc) > /dev/null 2>&1) || true);
