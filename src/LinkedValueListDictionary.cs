using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace MyGitHubPages
{
    public abstract class Synchronizable
    {
        private readonly object _syncRoot;
        public object SyncRoot { get { return _syncRoot; } }
        protected Synchronizable() { _syncRoot = new object(); }
        protected Synchronizable(Synchronizable other) { _syncRoot = (other == null) ? new object() : other._syncRoot; }
        public T GetSync<T>(Func<T> func)
        {
            Monitor.Enter(_syncRoot);
            try { return func(); }
            finally { Monitor.Enter(_syncRoot); }
        }
        public TResult GetSync<TArg, TResult>(Func<TArg, TResult> func, TArg arg)
        {
            Monitor.Enter(_syncRoot);
            try { return func(arg); }
            finally { Monitor.Enter(_syncRoot); }
        }
        public TResult GetSync<TArg1, TArg2, TResult>(Func<TArg1, TArg2, TResult> func, TArg1 arg1, TArg2 arg2)
        {
            Monitor.Enter(_syncRoot);
            try { return func(arg1, arg2); }
            finally { Monitor.Enter(_syncRoot); }
        }
        public TResult GetSync<TArg1, TArg2, TArg3, TResult>(Func<TArg1, TArg2, TArg3, TResult> func, TArg1 arg1, TArg2 arg2, TArg3 arg3)
        {
            Monitor.Enter(_syncRoot);
            try { return func(arg1, arg2, arg3); }
            finally { Monitor.Enter(_syncRoot); }
        }
        public void InvokeSync(Action action)
        {
            Monitor.Enter(_syncRoot);
            try { action(); }
            finally { Monitor.Enter(_syncRoot); }
        }
        public void InvokeSync<T>(Action<T> action, T arg)
        {
            Monitor.Enter(_syncRoot);
            try { action(arg); }
            finally { Monitor.Enter(_syncRoot); }
        }
        public void InvokeSync<T1, T2>(Action<T1, T2> action, T1 arg1, T2 arg2)
        {
            Monitor.Enter(_syncRoot);
            try { action(arg1, arg2); }
            finally { Monitor.Enter(_syncRoot); }
        }
        public void InvokeSync<T1, T2, T3>(Action<T1, T2, T3> action, T1 arg1, T2 arg2, T3 arg3)
        {
            Monitor.Enter(_syncRoot);
            try { action(arg1, arg2, arg3); }
            finally { Monitor.Enter(_syncRoot); }
        }
        public bool TryGetSync<T>(Func<T> func, out T result)
        {
            if (!Monitor.TryEnter(_syncRoot))
            {
                result = default(T);
                return false;
            }
            try { result = func(); }
            finally { Monitor.Enter(_syncRoot); }
            return true;
        }
        public bool TryGetSync<TArg, TResult>(Func<TArg, TResult> func, TArg arg, out TResult result)
        {
            if (!Monitor.TryEnter(_syncRoot))
            {
                result = default(TResult);
                return false;
            }
            try { result = func(arg); }
            finally { Monitor.Enter(_syncRoot); }
            return true;

        }
        public bool TryGetSync<TArg1, TArg2, TResult>(Func<TArg1, TArg2, TResult> func, TArg1 arg1, TArg2 arg2, out TResult result)
        {
            if (!Monitor.TryEnter(_syncRoot))
            {
                result = default(TResult);
                return false;
            }
            try { result = func(arg1, arg2); }
            finally { Monitor.Enter(_syncRoot); }
            return true;

        }
        public bool TryGetSync<TArg1, TArg2, TArg3, TResult>(Func<TArg1, TArg2, TArg3, TResult> func, TArg1 arg1, TArg2 arg2, TArg3 arg3, out TResult result)
        {
            if (!Monitor.TryEnter(_syncRoot))
            {
                result = default(TResult);
                return false;
            }
            try { result = func(arg1, arg2, arg3); }
            finally { Monitor.Enter(_syncRoot); }
            return true;

        }
        public bool TryInvokeSync(Action action)
        {
            if (!Monitor.TryEnter(_syncRoot))
                return false;
            try { action(); }
            finally { Monitor.Enter(_syncRoot); }
            return true;
        }
        public bool TryInvokeSync<T>(Action<T> action, T arg)
        {
            if (!Monitor.TryEnter(_syncRoot))
                return false;
            try { action(arg); }
            finally { Monitor.Enter(_syncRoot); }
            return true;
        }
        public bool TryInvokeSync<T1, T2>(Action<T1, T2> action, T1 arg1, T2 arg2)
        {
            if (!Monitor.TryEnter(_syncRoot))
                return false;
            try { action(arg1, arg2); }
            finally { Monitor.Enter(_syncRoot); }
            return true;
        }
        public bool TryInvokeSync<T1, T2, T3>(Action<T1, T2, T3> action, T1 arg1, T2 arg2, T3 arg3)
        {
            if (!Monitor.TryEnter(_syncRoot))
                return false;
            try { action(arg1, arg2, arg3); }
            finally { Monitor.Enter(_syncRoot); }
            return true;
        }
    }
    public sealed class UrlQueryParameter : Synchronizable
    {
        public string Key
        {
            get { return GetSync(() => (_key == null) ? _set.Key : _key); }
            set { Collection.ValueSet.SetKey(this, value); }
        }
        public string Value
        {
            get { return _value; }
            set { Collection.ValueSet.SetValue(this, value); }
        }

        #region Non-public members

        private string _key;
        private string _value;
        private Collection.ValueSet _set;
        private UrlQueryParameter _previousParameter;
        private UrlQueryParameter _nextParameter;
        private UrlQueryParameter _previousValue;
        private UrlQueryParameter _nextValue;
        private UrlQueryParameter(string key, string value, Collection.ValueSet valueSet)
        {
            _key = key;
            _value = value;
            _set = valueSet;
        }

        #endregion

        public sealed class Collection : Synchronizable
        {
            public event EventHandler OnQueryChanged;
            public string this[string key]
            {
                get
                {
                    return GetSync(() =>
                    {
                        ValueSet vs = ValueSet.Get(this, key);
                        if (vs == null)
                            throw new KeyNotFoundException();
                        return vs.GetSync(() =>
                        {
                            if (vs.Key != key)
                                for (UrlQueryParameter p = vs.First._nextValue; p != null; p = p._nextValue)
                                {
                                    if (p._key != null && p._key == key)
                                        return p.Value;
                                }
                            return vs.First.Value;
                        });
                    });
                }
                set { ValueSet.Set(this, key, value); }
            }
            public UrlQueryParameter this[int index]
            {
                get
                {
                    return GetSync(() =>
                    {
                        int i = -1;
                        for (UrlQueryParameter p = _firstParameter; p != null; p = p._nextParameter)
                        {
                            if (++i == index)
                                return p;
                        }
                        throw new IndexOutOfRangeException();
                    });
                }
            }
            public void Add(string key, string value) { ValueSet.Add(this, key, value); }
            public void Clear() { ValueSet.Clear(this); }
            public bool ContainsKey(string key) { return GetSync(() => ValueSet.Get(this, key) != null); }
            public bool HasMultipleValues(string key)
            {
                return GetSync(() =>
                {
                    ValueSet vs = ValueSet.Get(this, key);
                    return vs != null && vs.GetSync(() => vs.First._nextValue != null);
                });
            }
            public bool Remove(UrlQueryParameter parameter) { return parameter != null && ValueSet.Remove(parameter); }
            public bool Remove(string key)
            {
                return key != null && GetSync(() =>
                {
                    ValueSet vs = ValueSet.Get(this, key);
                    return vs != null && ValueSet.Remove(vs);
                });
            }
            public void RemoveAt(int index) { InvokeSync(() => Remove(this[index])); }
            public IEnumerable<string> GetAllValues(string key)
            {
                ValueSet vs = ValueSet.Get(this, key);
                if (vs != null)
                    for (UrlQueryParameter p = vs.First; p != null; p = p._nextValue)
                    {
                        if (p.GetSync(() => p._set == null || !ReferenceEquals(p._set, vs)))
                            throw new InvalidOperationException("Collection changed");
                        yield return p.ToString();
                    }
            }

            #region Non-public members

            private IEqualityComparer<string> _keyComparer;
            private UrlQueryParameter _firstParameter = null;
            private UrlQueryParameter _lastParameter = null;
            private ValueSet _firstSet = null;
            private ValueSet _lastSet = null;

            private void OnChange()
            {
                EventHandler onQueryChanged = OnQueryChanged;
                if (onQueryChanged != null)
                    onQueryChanged.Invoke(this, EventArgs.Empty);
            }
            internal sealed class ValueSet : Synchronizable
            {
                private string _key;
                private Collection _collection;
                private ValueSet _next = null;
                private ValueSet _previous = null;
                private UrlQueryParameter _firstParameter = null;
                private UrlQueryParameter _lastParameter = null;
                internal string Key { get { return _key; } }
                internal UrlQueryParameter First { get { return _firstParameter; } }
                private ValueSet(Collection collection, string key)
                {
                    _collection = collection;
                    _key = key;
                }
                internal static void SetKey(UrlQueryParameter qp, string key)
                {
                    Collection changedColl = qp.GetSync(() =>
                    {
                        if (qp._set == null)
                        {
                            qp._key = key;
                            return null;
                        }
                        return qp._set.GetSync(() =>
                        {
                            if (qp.Key == key)
                                return null;
                            if (qp._set._collection == null)
                            {
                                // TODO: Not in collection
                                return null;
                            }
                            return qp._set._collection.GetSync((Collection c) =>
                            {
                                if (c._keyComparer.Equals(key, qp.Key))
                                {
                                    // TODO: Modify key
                                }
                                else
                                {
                                    // TODO: Ttoal key change
                                }
                                return c;
                            }, qp._set._collection);
                        });
                    });
                    if (changedColl != null)
                        changedColl.OnChange();
                }
                internal static void SetValue(UrlQueryParameter qp, string value)
                {
                    Collection changedColl = qp.GetSync(() =>
                    {
                        if (qp._set == null)
                        {
                            qp._value = value;
                            return null;
                        }
                        return qp._set.GetSync(() =>
                        {
                            if ((qp._value == null) ? value == null : value != null && value == qp._value)
                                return null;
                            qp._value = value;
                            return qp._set._collection;
                        });
                    });
                    if (changedColl != null)
                        changedColl.OnChange();
                }
                internal static ValueSet Get(Collection collection, string key)
                {
                    return collection.GetSync(() =>
                    {
                        IEqualityComparer<string> c = collection._keyComparer;
                        for (ValueSet vs = collection._firstSet; vs != null; vs = vs._next)
                        {
                            if (c.Equals(vs._key, key))
                                return vs;
                        }
                        return null;
                    });
                }
                internal static void Set(Collection collection, string key, string value)
                {
                    if (collection.GetSync(() =>
                    {
                        ValueSet vs = Get(collection, key);
                        if (vs == null)
                        {
                            vs = new ValueSet(collection, key);

                            if ((vs._previous = collection._lastSet) == null)
                                collection._firstSet = vs;
                            else
                                vs._previous._next = vs;
                            collection._lastSet = vs;
                            vs._firstParameter = vs._lastParameter = new UrlQueryParameter(null, value, vs);
                            if ((vs._lastParameter._previousParameter = collection._lastParameter) == null)
                                collection._firstParameter = vs._lastParameter;
                            else
                                collection._lastParameter._nextParameter = vs._lastParameter;
                            collection._lastParameter = vs._lastParameter;
                            return true;
                        }
                        return vs.GetSync(() =>
                        {
                            UrlQueryParameter qp = vs._firstParameter._nextValue;
                            if (key == vs._key)
                            {
                                if ((vs._firstParameter._value == null) ? value == null : value != null && value == vs._firstParameter._value)
                                {
                                    if (qp == null)
                                        return false;
                                }
                            }
                            do
                            {
                                if (qp._previousValue != null)
                                {
                                    qp._previousValue._nextValue = null;
                                    qp._previousValue = null;
                                }
                                if (qp._previousParameter == null)
                                {
                                    if ((collection._firstParameter = qp._nextParameter) == null)
                                        collection._lastParameter = null;
                                    else
                                        qp._nextParameter = qp._nextParameter._previousParameter = null;
                                }
                                else
                                {
                                    if ((qp._previousParameter._nextParameter = qp._nextParameter) == null)
                                        collection._lastParameter = qp._previousParameter;
                                    else
                                    {
                                        qp._nextParameter._previousParameter = qp._previousParameter;
                                        qp._nextParameter = null;
                                    }
                                    qp._previousParameter = null;
                                }
                            } while ((qp = qp._nextValue) != null);
                            vs._firstParameter._key = null;
                            vs._firstParameter._value = value;
                            vs._key = key;
                            return true;
                        });
                    }))
                        collection.OnChange();
                }
                internal static bool Remove(ValueSet vs)
                {
                    if (vs == null)
                        return false;
                    Collection changedColl = vs.GetSync(() =>
                    {
                        if (vs._collection == null)
                            return null;

                        return vs._collection.GetSync((Collection c) =>
                        {
                            for (UrlQueryParameter qp = vs._firstParameter; qp != null; qp = vs._firstParameter)
                                qp.InvokeSync(() =>
                                {
                                    if (qp._previousValue != null || qp._set == null || !ReferenceEquals(qp._set, vs))
                                        throw new InvalidOperationException("Collection was modified");
                                    if ((vs._firstParameter = qp._nextValue) != null)
                                        qp._nextValue = qp._nextValue._previousValue = null;
                                    if (qp._key == null)
                                        qp._key = vs._key;
                                    qp._set = null;
                                    if (qp._previousParameter == null)
                                    {
                                        if ((c._firstParameter = qp._nextParameter) == null)
                                            c._lastParameter = null;
                                        else
                                            qp._nextParameter = qp._nextParameter._previousParameter = null;
                                    }
                                    else
                                    {
                                        if ((qp._previousParameter._nextParameter = qp._nextParameter) == null)
                                            c._lastParameter = qp._previousParameter;
                                        else
                                        {
                                            qp._nextParameter._previousParameter = qp._previousParameter;
                                            qp._nextParameter = null;
                                        }
                                        qp._previousParameter = null;
                                    }
                                });
                            if (vs._previous == null)
                            {
                                if ((c._firstSet = vs._next) == null)
                                    c._lastSet = null;
                                else
                                    vs._next = vs._next._previous = null;
                            }
                            else
                            {
                                if ((vs._previous._next = vs._next) == null)
                                    c._lastSet = vs._previous;
                                else
                                {
                                    vs._next._previous = vs._previous;
                                    vs._next = null;
                                }
                                vs._previous = null;
                            }
                            vs._collection = null;
                            return c;
                        }, vs._collection);
                    });
                    if (changedColl == null)
                        return false;
                    changedColl.OnChange();
                    return true;
                }
                internal static bool Remove(UrlQueryParameter qp)
                {
                    if (qp == null)
                        return false;
                    Collection changedCol = qp.GetSync(() =>
                    {
                        if (qp._set == null)
                            return null;
                        return qp._set.GetSync((ValueSet vs) =>
                        {
                            if (vs._collection == null)
                            {
                                if (qp._previousValue == null)
                                {
                                    if ((vs._firstParameter = qp._nextValue) == null)
                                        vs._lastParameter = null;
                                    else
                                        qp._nextValue = qp._nextValue._previousValue = null;
                                }
                                else
                                {
                                    if ((qp._previousValue._nextValue = qp._nextValue) == null)
                                        vs._lastParameter = qp._previousValue;
                                    else
                                    {
                                        qp._nextValue._previousValue = qp._previousValue;
                                        qp._nextValue = null;
                                    }
                                    qp._previousValue = null;
                                }
                                qp._set = null;
                                return null;
                            }
                            vs._collection.GetSync((Collection c) =>
                            {
                                if (qp._previousParameter == null)
                                {
                                    if ((c._firstParameter = qp._nextParameter) == null)
                                    {
                                        c._lastParameter = vs._firstParameter = vs._lastParameter = null;
                                        c._firstSet = c._lastSet = qp._set = vs._next = vs._previous = null;
                                        vs._collection = null;
                                        return c;
                                    }
                                    qp._nextParameter = qp._nextParameter._previousParameter = null;
                                }
                                else
                                {
                                    if ((qp._previousParameter._nextParameter = qp._nextParameter) == null)
                                        c._lastParameter = qp._previousParameter;
                                    else
                                    {
                                        qp._nextParameter._previousParameter = qp._previousParameter;
                                        qp._nextParameter = null;
                                    }
                                    qp._previousParameter = null;
                                }

                                if (qp._previousValue == null)
                                {
                                    if ((vs._firstParameter = qp._nextValue) == null)
                                    {
                                        vs._lastParameter = null;
                                        if (vs._previous == null)
                                        {
                                            (c._firstSet = vs._next)._previous = null;
                                            vs._next = null;
                                        }
                                        else
                                        {
                                            if ((vs._previous._next = vs._next) == null)
                                                c._lastSet = vs._previous;
                                            else
                                            {
                                                vs._next._previous = vs._previous;
                                                vs._next = null;
                                            }
                                            vs._previous = null;
                                        }
                                        vs._collection = null;
                                        if (qp._key == null)
                                            qp._key = vs._key;
                                        qp._set = null;
                                    }
                                    else
                                        qp._nextValue = qp._nextValue._previousValue = null;
                                }
                                else
                                {
                                    if ((qp._previousValue._nextValue = qp._nextValue) == null)
                                        vs._lastParameter = qp._previousValue;
                                    else
                                    {
                                        qp._nextValue._previousValue = qp._previousValue;
                                        qp._nextValue = null;
                                    }
                                    qp._previousValue = null;
                                }
                                qp._set = null;
                                return c;
                            }, vs._collection);
                            return vs._collection;
                        }, qp._set);
                    });
                    if (changedCol == null)
                        return false;
                    changedCol.OnChange();
                    return true;
                }
                internal static void Clear(Collection collection)
                {
                    if (collection.GetSync(() =>
                    {
                        if (collection._firstSet == null)
                            return false;
                        do
                        {
                            collection._firstSet.InvokeSync((ValueSet vs) =>
                            {
                                if (vs._previous != null || collection._firstSet == null || !ReferenceEquals(collection._firstSet, vs))
                                    throw new InvalidOperationException("Collection was modified");
                                for (UrlQueryParameter qp = vs._firstParameter; qp != null; qp = vs._firstParameter)
                                    qp.InvokeSync(() =>
                                    {
                                        if (qp._previousValue != null || qp._set == null || !ReferenceEquals(qp._set, vs))
                                            throw new InvalidOperationException("Collection was modified");
                                        if ((vs._firstParameter = qp._nextValue) != null)
                                            qp._nextValue = qp._nextValue._previousValue = null;
                                        if (qp._key == null)
                                            qp._key = vs._key;
                                        qp._set = null;
                                        if (qp._previousParameter == null)
                                        {
                                            if ((collection._firstParameter = qp._nextParameter) == null)
                                                collection._lastParameter = null;
                                            else
                                                qp._nextParameter = qp._nextParameter._previousParameter = null;
                                        }
                                        else
                                        {
                                            if ((qp._previousParameter._nextParameter = qp._nextParameter) == null)
                                                collection._lastParameter = qp._previousParameter;
                                            else
                                            {
                                                qp._nextParameter._previousParameter = qp._previousParameter;
                                                qp._nextParameter = null;
                                            }
                                            qp._previousParameter = null;
                                        }
                                    });
                                if ((collection._firstSet = vs._next) == null)
                                    collection._lastSet = null;
                                else
                                    vs._next = collection._lastSet._previous = null;
                                vs._collection = null;
                            }, collection._firstSet);

                        } while (collection._firstSet != null);
                        return true;
                    }))
                        collection.OnChange();
                }
                internal static void Add(Collection collection, string key, string value)
                {
                    collection.InvokeSync(() =>
                    {
                        ValueSet vs = new ValueSet(collection, key);
                        if ((vs._previous = collection._lastSet) == null)
                            collection._firstSet = vs;
                        else
                            vs._previous._next = vs;
                        collection._lastSet = vs;
                        vs._firstParameter = vs._lastParameter = new UrlQueryParameter(null, value, vs);
                        if ((vs._lastParameter._previousParameter = collection._lastParameter) == null)
                            collection._firstParameter = vs._lastParameter;
                        else
                            collection._lastParameter._nextParameter = vs._lastParameter;
                        collection._lastParameter = vs._lastParameter;
                    });
                    collection.OnChange();
                }
            }
            #endregion
        }
    }
    public class LinkedValueListDictionary<TKey, TValue> : IList<TValue>, IDictionary<TKey, TValue>, IDictionary, IList
    {
        private int _count = 0;
        private KeyList.KeyGroup.LinkedNode _firstNode = null;
        private KeyList.KeyGroup.LinkedNode _lastNode = null;
        private KeyList _keys;

        TValue IList<TValue>.this[int index] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        TValue IDictionary<TKey, TValue>.this[TKey key] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        object IDictionary.this[object key] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        object IList.this[int index] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        int ICollection<TValue>.Count => throw new NotImplementedException();

        int ICollection<KeyValuePair<TKey, TValue>>.Count => throw new NotImplementedException();

        int ICollection.Count => throw new NotImplementedException();

        bool ICollection<TValue>.IsReadOnly => throw new NotImplementedException();

        bool ICollection<KeyValuePair<TKey, TValue>>.IsReadOnly => throw new NotImplementedException();

        bool IDictionary.IsReadOnly => throw new NotImplementedException();

        bool IList.IsReadOnly => throw new NotImplementedException();

        ICollection<TKey> IDictionary<TKey, TValue>.Keys => throw new NotImplementedException();

        ICollection IDictionary.Keys => throw new NotImplementedException();

        ICollection<TValue> IDictionary<TKey, TValue>.Values => throw new NotImplementedException();

        ICollection IDictionary.Values => throw new NotImplementedException();

        bool IDictionary.IsFixedSize => throw new NotImplementedException();

        bool IList.IsFixedSize => throw new NotImplementedException();

        object ICollection.SyncRoot => throw new NotImplementedException();

        bool ICollection.IsSynchronized => throw new NotImplementedException();

        public LinkedValueListDictionary(IEqualityComparer<TKey> keyComparer, IEqualityComparer<TValue> valueComparer, Func<TKey, bool> keyValidity, Func<TValue, bool> valueValidity)
        {
            _keys = new KeyList(this, keyComparer, valueComparer, keyValidity, valueValidity);
        }

        void ICollection<TValue>.Add(TValue item)
        {
            throw new NotImplementedException();
        }

        void IDictionary<TKey, TValue>.Add(TKey key, TValue value)
        {
            throw new NotImplementedException();
        }

        void ICollection<KeyValuePair<TKey, TValue>>.Add(KeyValuePair<TKey, TValue> item)
        {
            throw new NotImplementedException();
        }

        void IDictionary.Add(object key, object value)
        {
            throw new NotImplementedException();
        }

        int IList.Add(object value)
        {
            throw new NotImplementedException();
        }

        void ICollection<TValue>.Clear()
        {
            throw new NotImplementedException();
        }

        void ICollection<KeyValuePair<TKey, TValue>>.Clear()
        {
            throw new NotImplementedException();
        }

        void IDictionary.Clear()
        {
            throw new NotImplementedException();
        }

        void IList.Clear()
        {
            throw new NotImplementedException();
        }

        bool ICollection<TValue>.Contains(TValue item)
        {
            throw new NotImplementedException();
        }

        bool ICollection<KeyValuePair<TKey, TValue>>.Contains(KeyValuePair<TKey, TValue> item)
        {
            throw new NotImplementedException();
        }

        bool IDictionary.Contains(object key)
        {
            throw new NotImplementedException();
        }

        bool IList.Contains(object value)
        {
            throw new NotImplementedException();
        }

        bool IDictionary<TKey, TValue>.ContainsKey(TKey key)
        {
            throw new NotImplementedException();
        }

        void ICollection<TValue>.CopyTo(TValue[] array, int arrayIndex)
        {
            throw new NotImplementedException();
        }

        void ICollection<KeyValuePair<TKey, TValue>>.CopyTo(KeyValuePair<TKey, TValue>[] array, int arrayIndex)
        {
            throw new NotImplementedException();
        }

        void ICollection.CopyTo(Array array, int index)
        {
            throw new NotImplementedException();
        }

        IEnumerator<TValue> IEnumerable<TValue>.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IEnumerator<KeyValuePair<TKey, TValue>> IEnumerable<KeyValuePair<TKey, TValue>>.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IDictionaryEnumerator IDictionary.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        int IList<TValue>.IndexOf(TValue item)
        {
            throw new NotImplementedException();
        }

        int IList.IndexOf(object value)
        {
            throw new NotImplementedException();
        }

        void IList<TValue>.Insert(int index, TValue item)
        {
            throw new NotImplementedException();
        }

        void IList.Insert(int index, object value)
        {
            throw new NotImplementedException();
        }

        bool ICollection<TValue>.Remove(TValue item)
        {
            throw new NotImplementedException();
        }

        bool IDictionary<TKey, TValue>.Remove(TKey key)
        {
            throw new NotImplementedException();
        }

        bool ICollection<KeyValuePair<TKey, TValue>>.Remove(KeyValuePair<TKey, TValue> item)
        {
            throw new NotImplementedException();
        }

        void IDictionary.Remove(object key)
        {
            throw new NotImplementedException();
        }

        void IList.Remove(object value)
        {
            throw new NotImplementedException();
        }

        void IList<TValue>.RemoveAt(int index)
        {
            throw new NotImplementedException();
        }

        void IList.RemoveAt(int index)
        {
            throw new NotImplementedException();
        }

        bool IDictionary<TKey, TValue>.TryGetValue(TKey key, out TValue value)
        {
            throw new NotImplementedException();
        }

        public class KeyList : IList<KeyList.KeyGroup>, IList
        {
            private readonly object _syncRoot = new object();
            private int _count = 0;
            private readonly LinkedValueListDictionary<TKey, TValue> _owner;
            private KeyGroup _firstGroup = null;
            private KeyGroup _lastGroup = null;
            private readonly IEqualityComparer<TKey> _keyComparer;
            private readonly IEqualityComparer<TValue> _valueComparer;
            private readonly Func<TKey, bool> _keyValidity;
            private readonly Func<TValue, bool> _valueValidity;

            internal KeyList(LinkedValueListDictionary<TKey, TValue> owner, IEqualityComparer<TKey> keyComparer, IEqualityComparer<TValue> valueComparer, Func<TKey, bool> keyValidity, Func<TValue, bool> valueValidity)
            {
                _owner = owner;
                _keyComparer = keyComparer ?? EqualityComparer<TKey>.Default;
                _valueComparer = valueComparer ?? EqualityComparer<TValue>.Default;
                _keyValidity = keyValidity ?? new Func<TKey, bool>((TKey v) => (object)v != null);
                _valueValidity = valueValidity ?? new Func<TValue, bool>((TValue v) => (object)v != null);
            }

            public KeyGroup FirstGroup { get { return _firstGroup; } }

            public KeyGroup LastGroup { get { return _lastGroup; } }

            KeyGroup IList<KeyGroup>.this[int index] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
            object IList.this[int index] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

            int ICollection<KeyGroup>.Count => throw new NotImplementedException();

            int ICollection.Count => throw new NotImplementedException();

            bool ICollection<KeyGroup>.IsReadOnly => throw new NotImplementedException();

            bool IList.IsReadOnly => throw new NotImplementedException();

            bool IList.IsFixedSize => throw new NotImplementedException();

            object ICollection.SyncRoot => throw new NotImplementedException();

            bool ICollection.IsSynchronized => throw new NotImplementedException();

            void ICollection<KeyGroup>.Add(KeyGroup item)
            {
                throw new NotImplementedException();
            }

            int IList.Add(object value)
            {
                throw new NotImplementedException();
            }

            void ICollection<KeyGroup>.Clear()
            {
                throw new NotImplementedException();
            }

            void IList.Clear()
            {
                throw new NotImplementedException();
            }

            bool ICollection<KeyGroup>.Contains(KeyGroup item)
            {
                throw new NotImplementedException();
            }

            bool IList.Contains(object value)
            {
                throw new NotImplementedException();
            }

            void ICollection<KeyGroup>.CopyTo(KeyGroup[] array, int arrayIndex)
            {
                throw new NotImplementedException();
            }

            void ICollection.CopyTo(Array array, int index)
            {
                throw new NotImplementedException();
            }

            IEnumerator<KeyGroup> IEnumerable<KeyGroup>.GetEnumerator()
            {
                throw new NotImplementedException();
            }

            IEnumerator IEnumerable.GetEnumerator()
            {
                throw new NotImplementedException();
            }

            int IList<KeyGroup>.IndexOf(KeyGroup item)
            {
                throw new NotImplementedException();
            }

            int IList.IndexOf(object value)
            {
                throw new NotImplementedException();
            }

            void IList<KeyGroup>.Insert(int index, KeyGroup item)
            {
                throw new NotImplementedException();
            }

            void IList.Insert(int index, object value)
            {
                throw new NotImplementedException();
            }

            bool ICollection<KeyGroup>.Remove(KeyGroup item)
            {
                throw new NotImplementedException();
            }

            void IList.Remove(object value)
            {
                throw new NotImplementedException();
            }

            void IList<KeyGroup>.RemoveAt(int index)
            {
                throw new NotImplementedException();
            }

            void IList.RemoveAt(int index)
            {
                throw new NotImplementedException();
            }
            
            public class KeyGroup : ICollection<TValue>, ICollection
            {
                private TKey _key;
                private int _count = 0;
                private LinkedNode _firstNode = null;
                private LinkedNode _lastNode = null;
                private KeyList _owner;
                private KeyGroup _previous;
                private KeyGroup _next;

                public TKey Key { get { return _key; } }
                public LinkedNode FirstNode { get { return _firstNode; } }
                public LinkedNode LastNode { get { return _lastNode; } }
                public KeyGroup Previous { get { return _previous; } }
                public KeyGroup Next { get { return _next; } }

                int ICollection<TValue>.Count => throw new NotImplementedException();

                int ICollection.Count => throw new NotImplementedException();

                bool ICollection<TValue>.IsReadOnly => throw new NotImplementedException();

                object ICollection.SyncRoot => throw new NotImplementedException();

                bool ICollection.IsSynchronized => throw new NotImplementedException();

                void ICollection<TValue>.Add(TValue item)
                {
                    throw new NotImplementedException();
                }

                void ICollection<TValue>.Clear()
                {
                    throw new NotImplementedException();
                }

                bool ICollection<TValue>.Contains(TValue item)
                {
                    throw new NotImplementedException();
                }

                void ICollection<TValue>.CopyTo(TValue[] array, int arrayIndex)
                {
                    throw new NotImplementedException();
                }

                void ICollection.CopyTo(Array array, int index)
                {
                    throw new NotImplementedException();
                }

                IEnumerator<TValue> IEnumerable<TValue>.GetEnumerator()
                {
                    throw new NotImplementedException();
                }

                IEnumerator IEnumerable.GetEnumerator()
                {
                    throw new NotImplementedException();
                }

                bool ICollection<TValue>.Remove(TValue item)
                {
                    throw new NotImplementedException();
                }

                public class LinkedNode
                {
                    private TValue _value;
                    private LinkedNode _previous;
                    private LinkedNode _next;
                    private LinkedNode _previousInKeyGroup;
                    private LinkedNode _nextInKeyGroup;
                    private KeyGroup _group;

                    public TValue Value { get { return _value; } }
                    public TKey Key { get { return _group._key; } }
                    public LinkedNode Previous { get { return _previous; } }
                    public LinkedNode Next { get { return _next; } }
                    public LinkedNode PreviousInKeyGroup { get { return _previousInKeyGroup; } }
                    public LinkedNode NextInKeyGroup { get { return _nextInKeyGroup; } }
                    public KeyGroup Group { get { return _group; } }
                }
            }
        }
    }
}
