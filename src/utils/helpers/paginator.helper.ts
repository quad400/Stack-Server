class Paginator {
  query: Record<string, any>;
  queryString: any;

  constructor(query: Record<string, any>, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "q"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort?.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  search() {
    if (this.queryString.q) {
      const searchField = this.queryString.q;
      console.log(searchField);

      this.query = this.query.find({ $text: { $search: searchField } });
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  async paginateResult() {
    const totalCount = await this.query.model.countDocuments();

    const results = await this.query;

    const totalPages = Math.ceil(
      totalCount / (this.queryString.limit * 1 || 100)
    );

    return {
      currentPage: this.queryString.page ? parseInt(this.queryString.page) : 1,
      totalPages,
      results,
    };
  }
}

export default Paginator;
