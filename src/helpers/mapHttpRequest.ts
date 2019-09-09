export default (req: any = {}) => {
	return {
		path: req.path,
		method: req.method,
		pathParams: req.params,
		queryParams: req.query,
		body: req.body
	};
};
