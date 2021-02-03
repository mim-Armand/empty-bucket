

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const emptyBucket = async function(Bucket) {
  const params = { Bucket };
  const objs = await s3.listObjectsV2(params).promise();
  if( !objs.Contents.length ) return;
  const delParams = {
    Bucket,
    Delete: {
      Quiet: true,
      Objects: objs.Contents.map( o => ({Key: o.Key}))
    }};
  await s3.deleteObjects(delParams).promise();
  if(!!objs.NextContinuationToken){
    return await emptyBucket(Bucket);
  }else{
    return;
  }
}


const fillBucket = async function(Bucket, count = 100) {
  let params = {
    Body: "This is just a sample file.",
    Bucket,
    Key: "file.txt"
  };
  const arr = new Array(count);
  arr.fill(".");
  return Promise.all(arr.map( (a, i) => {
    params.Key = `file_${i}.txt`;
    return s3.putObject(params).promise();
  }));
}

exports.emptyBucket = emptyBucket;
exports.fillBucket = fillBucket;