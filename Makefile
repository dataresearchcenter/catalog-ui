all: clean publish

install:
	npm i

out: clean
	npm run build

publish: out
	aws s3 --endpoint-url https://s3.investigativedata.org sync ./out s3://dataresearchcenter.org/library

clean:
	rm -rf .next
	rm -rf out

serve: out
	cd out ; python3 -m http.server
