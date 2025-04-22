# =============================================================================
# benchmark

node_restful:
	docker-compose -f docker/docker-compose.yml exec wrk \wrk -t4 -c200 -d30s --latency -s /app/scripts/stats.lua http://node:3000/users

node_graphql:
	docker-compose -f docker/docker-compose.yml exec wrk \wrk -t4 -c200 -d30s --latency -s /app/scripts/graphql_benchmark.lua http://node:3000/graphql

# =============================================================================
# run

rnode:
	make knode \
	&& docker-compose -f docker/docker-compose.yml up --build node

rwrk:
	make kwrk \
	&& docker-compose -f docker/docker-compose.yml up -d --build wrk

# =============================================================================
# kill

knode:
	export KILL=node \
	&& make -Bs _kill;

kwrk:
	export KILL=wrk \
	&& make -Bs _kill;

_kill:
	((docker kill $$(docker ps -q --no-trunc --filter name=^$(KILL)) > /dev/null 2>&1) || true) \
	&& ((docker rm -f $$(docker ps -a -q --no-trunc --filter name=^$(KILL)) > /dev/null 2>&1) || true) \
	&& ((docker rmi -f $$(docker images -f "dangling=true" -q --no-trunc) > /dev/null 2>&1) || true);
