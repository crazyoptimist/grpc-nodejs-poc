// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var proto_blog_pb = require('../proto/blog_pb.js');

function serialize_blog_ListBlogRequest(arg) {
  if (!(arg instanceof proto_blog_pb.ListBlogRequest)) {
    throw new Error('Expected argument of type blog.ListBlogRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_ListBlogRequest(buffer_arg) {
  return proto_blog_pb.ListBlogRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_blog_ListBlogResponse(arg) {
  if (!(arg instanceof proto_blog_pb.ListBlogResponse)) {
    throw new Error('Expected argument of type blog.ListBlogResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blog_ListBlogResponse(buffer_arg) {
  return proto_blog_pb.ListBlogResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var BlogServiceService = exports.BlogServiceService = {
  listBlog: {
    path: '/blog.BlogService/ListBlog',
    requestStream: false,
    responseStream: true,
    requestType: proto_blog_pb.ListBlogRequest,
    responseType: proto_blog_pb.ListBlogResponse,
    requestSerialize: serialize_blog_ListBlogRequest,
    requestDeserialize: deserialize_blog_ListBlogRequest,
    responseSerialize: serialize_blog_ListBlogResponse,
    responseDeserialize: deserialize_blog_ListBlogResponse,
  },
};

exports.BlogServiceClient = grpc.makeGenericClientConstructor(BlogServiceService);
