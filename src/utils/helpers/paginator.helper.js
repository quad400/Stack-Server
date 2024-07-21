"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Paginator {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = Object.assign({}, this.queryString);
        const excludedFields = ["page", "sort", "limit", "fields", "q"];
        excludedFields.forEach((el) => delete queryObj[el]);
        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        var _a;
        if (this.queryString.sort) {
            const sortBy = (_a = this.queryString.sort) === null || _a === void 0 ? void 0 : _a.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        else {
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
    paginateResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalCount = yield this.query.model.countDocuments();
            const results = yield this.query;
            const totalPages = Math.ceil(totalCount / (this.queryString.limit * 1 || 100));
            return {
                currentPage: this.queryString.page ? parseInt(this.queryString.page) : 1,
                totalPages,
                results,
            };
        });
    }
}
exports.default = Paginator;
