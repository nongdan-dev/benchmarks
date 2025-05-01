# =============================================================================
# rebuild the docker image and run
# by default, this will not recompile the code if there is corresponding binary

rexpress: rnode;

rnest:
	export ENV="FRAMEWORK=nest" \
	&& make -Bs rnode;

rcluster:
	export ENV="CLUSTER=1" \
	&& make -Bs rnode;

rultimate:
	export ENV="FRAMEWORK=ultimate CLUSTER=1" \
	&& make -Bs rnode;

rnode:
	make -Bs knode \
	&& export RUN=benchmarks-node \
	&& make -Bs _run;

# also rebuild tsc dist
rnode2:
	rm -f ./node/dist \
	&& make -Bs rnode;

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
	&& export RUN="benchmarks-node benchmarks-go benchmarks-rust benchmarks-wrk" \
	&& make -Bs _run;

# shortcut to rebuild the docker image and run
_run:
	docker compose build $(RUN) --force-rm \
	&& $(ENV) docker compose up $(RUN) -d --remove-orphans;

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
	&& ((docker rmi -f $$(docker images -f dangling=true -q --no-trunc) > /dev/null 2>&1) || true);
