/** A daily allowance belongs to the recipient and procedure, across casters,
 * effect replacements and scene-token changes. Use the event's date, not the
 * end of a multi-day time advance, when processing historical ticks. */
export function dailyConsequenceAllowance(actor,limit,at){
 if(!limit)return null;
 if(typeof limit.key!=='string'||!limit.key||!Number.isInteger(limit.maximum)||limit.maximum<1||!Number.isFinite(at))throw Error('Invalid daily consequence allowance');
 const day=Math.floor(at/86400),rows=Array.from(actor.flags?.['trudvang-chronicles']?.consequenceDailyUsage??[]);
 const used=rows.filter(row=>row.key===limit.key&&row.day===day).reduce((sum,row)=>sum+Math.max(0,Number(row.amount)||0),0);
 return {remaining:Math.max(0,limit.maximum-used),day,used,rows,key:limit.key};
}
export function dailyConsequenceUsage(allowance,amount){
 // Other procedures can still be catching up across midnight. Retain their
 // dates until they too are processed, rather than deleting them on each tick.
 const rows=allowance.rows.filter(row=>!(row.key===allowance.key&&row.day===allowance.day));
 rows.push({key:allowance.key,day:allowance.day,amount:allowance.used+amount});
 return rows;
}
